from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework import serializers, status
from rest_framework.permissions import IsAuthenticated

from words.models import KoreanWord

from nlp.korean_lemmatizer import KoreanLemmatizer
from nlp.example_derivation_model.example_deriver import ExampleDeriver
from nlp.models import DerivedExampleText, DerivedExampleLemma
from silk.profiling.profiler import silk_profile

from shared.cprofile_function_calls import cprofile_function_calls

from backend.settings import DEBUG
from time import perf_counter
from nlp.example_derivation_model.types import (
    LEMMA_IGNORED,
    LEMMA_AMBIGUOUS,
    NO_KNOWN_HEADWORDS,
    LEMMA_ALREADY_DISAMBIGUATED,
)


class DeriveExamplesFromTextValidator(serializers.Serializer):
    text = serializers.CharField(required=True, max_length=2000)
    source = serializers.CharField(required=True, max_length=100)


class DeriveExamplesFromFileValidator(serializers.Serializer):
    txt_file = serializers.FileField(required=True)
    source = serializers.CharField(required=True, max_length=100)


class DeriveExamplesFromTextView(APIView):

    permission_classes = (IsAuthenticated,)

    text_serializer_class = DeriveExamplesFromTextValidator
    txt_file_serializer_class = DeriveExamplesFromFileValidator

    SAVE_BATCH_SIZE = 512

    lemmatizer = KoreanLemmatizer(attach_다_to_verbs=True)
    example_deriver = ExampleDeriver()

    def _do_derivation_from_text(self, user, source, text):

        new_det = DerivedExampleText(text=text, source=source, user_that_added=user)
        new_det.save()

        to_add = []

        num_ambiguous = 0
        num_ignored = 0
        num_no_known_headwords = 0
        num_already_disambiguated = 0

        for derived_example in self.example_deriver.generate_examples_in_text(text):

            returned_pk = derived_example["headword_pk"]

            if returned_pk == LEMMA_IGNORED:
                if DEBUG:
                    num_ignored += 1
                continue
            elif returned_pk == LEMMA_AMBIGUOUS:
                if DEBUG:
                    num_ambiguous += 1
                continue
            elif returned_pk == NO_KNOWN_HEADWORDS:
                if DEBUG:
                    num_no_known_headwords += 1
                continue
            elif returned_pk == LEMMA_ALREADY_DISAMBIGUATED:
                if DEBUG:
                    num_already_disambiguated += 1
                continue
            else:
                to_add.append(
                    DerivedExampleLemma(
                        source_text=new_det,
                        lemma=derived_example["lemma"],
                        word_ref=KoreanWord(pk=returned_pk),
                        eojeol_number_in_source_text=derived_example["eojeol_num"],
                    )
                )

        created = DerivedExampleLemma.objects.bulk_create(
            to_add, batch_size=self.SAVE_BATCH_SIZE
        )

        if not DEBUG:
            return {"examples_written": len(created)}

        return {
            "examples_written": len(created),
            "num_ambiguous": num_ambiguous,
            "num_ignored": num_ignored,
            "num_no_known_headwords": num_no_known_headwords,
            "num_already_disambiguated": num_already_disambiguated,
        }

    def _do_derivation_from_file(self, user, source, in_memory_uploaded_file):
        all_bytes = in_memory_uploaded_file.read()
        text = all_bytes.decode("utf-8")

        return self._do_derivation_from_text(user, source, text)

    # @silk_profile(name="POST_DERIVE_EXAMPLES")
    def post(self, request, *args, **kwargs):

        user = request.user
        derivation_result = {}

        # file uploaded?
        if "txt_file" in request.FILES:
            serializer = self.txt_file_serializer_class(data=request.data)
            if not serializer.is_valid():
                return JsonResponse(serializer.errors, status.HTTP_400_BAD_REQUEST)
            derivation_result = self._do_derivation_from_file(
                user,
                serializer.validated_data["source"],
                serializer.validated_data["txt_file"],
            )

        # text uploaded?
        elif "text" in request.data:
            serializer = self.text_serializer_class(data=request.data)
            if not serializer.is_valid():
                return JsonResponse(
                    serializer.errors, status=status.HTTP_400_BAD_REQUEST
                )

            derivation_result = self._do_derivation_from_text(
                user,
                serializer.validated_data["source"],
                serializer.validated_data["text"],
            )

        # neither; error
        else:
            return JsonResponse(
                {"detail": "텍스트 혹은 .txt 파일이 제공되지 않았습니다."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not DEBUG:
            return JsonResponse(
                {
                    "detail": f"{derivation_result['lemmas_written']}개의 예문이 추가되었습니다."
                },
                status.HTTP_201_CREATED,
            )
        else:
            return JsonResponse(data=derivation_result, status=status.HTTP_201_CREATED)
