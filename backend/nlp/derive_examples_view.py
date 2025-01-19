from rest_framework.views import APIView
from rest_framework import serializers, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from words.models import KoreanWord

from nlp.korean_lemmatizer import KoreanLemmatizer
from nlp.example_derivation_model.example_deriver import ExampleDeriver
from nlp.models import DerivedExampleText, DerivedExampleLemma

from backend.settings import DEBUG
from time import perf_counter
from nlp.example_derivation_model.types import (
    LEMMA_IGNORED,
    LEMMA_AMBIGUOUS,
    NO_KNOWN_HEADWORDS,
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

    lemmatizer = KoreanLemmatizer(attach_다_to_verbs=True)
    example_deriver = ExampleDeriver()

    SAVE_BATCH_SIZE = 512

    def _do_derivation_from_text(self, user, source, text) -> int:
        time_in_db: float = 0

        before_new_det_save = perf_counter()
        new_det = DerivedExampleText(text=text, source=source, user_that_added=user)
        new_det.save()
        time_in_db = perf_counter() - before_new_det_save

        to_add = []

        total_lemmas = 0
        num_ignored_lemmas = 0
        num_disambiguated_lemmas = 0
        disambiguated_lemmas = []
        num_ambiguous_lemmas = 0
        num_lemmas_without_headwords = 0
        total_time_in_disambiguator: float = 0

        for derived_example in self.example_deriver.generate_examples_in_text(text):

            total_lemmas += 1

            time_in_disambiguator = derived_example["time_in_disambiguator"]
            if DEBUG and time_in_disambiguator > 0:
                num_disambiguated_lemmas += 1
                total_time_in_disambiguator += time_in_disambiguator
                disambiguated_lemmas.append(derived_example["lemma"])

            returned_pk = derived_example["headword_pk"]
            returned_korean_word = None

            if returned_pk == LEMMA_IGNORED:
                if DEBUG:
                    num_ignored_lemmas += 1
                continue
            elif returned_pk == LEMMA_AMBIGUOUS:
                if DEBUG:
                    num_ambiguous_lemmas += 1
                continue
            elif returned_pk == NO_KNOWN_HEADWORDS:
                if DEBUG:
                    num_lemmas_without_headwords += 1
                continue
            else:
                try:
                    returned_korean_word = KoreanWord.objects.get(pk=returned_pk)
                except KoreanWord.DoesNotExist:
                    # shouldnt ever be true because the pks themselves come from
                    # the db (get_headwords_for_lemma.py) and if there exist no
                    # headwords for a lemma then returned_pk should be
                    # NO_KNOWN_HEADWORDS
                    pass

            to_add.append(
                DerivedExampleLemma(
                    source_text=new_det,
                    lemma=derived_example["lemma"],
                    word_ref=returned_korean_word,
                    eojeol_number_in_source_text=derived_example["eojeol_num"],
                )
            )

        before_lemma_writes = perf_counter()
        created = DerivedExampleLemma.objects.bulk_create(
            to_add, batch_size=self.SAVE_BATCH_SIZE
        )
        time_in_db += perf_counter() - before_lemma_writes

        if not DEBUG:
            return {"examples_written": len(created)}

        return {
            "total_lemmas": total_lemmas,
            "examples_written": len(created),
            "lemmas_ignored": num_ignored_lemmas,
            "disambiguation": {
                "num_disambiguated_lemmas": num_disambiguated_lemmas,
                "disambiguated_lemmas": disambiguated_lemmas,
                "total_time_in_disambiguator": total_time_in_disambiguator,
                "avg_time_in_disambiguator": total_time_in_disambiguator
                / num_disambiguated_lemmas,
            },
            "time_in_db": time_in_db,
        }

    def _do_derivation_from_file(self, user, source, in_memory_uploaded_file) -> int:
        all_bytes = in_memory_uploaded_file.read()
        text = all_bytes.decode("utf-8")

        return self._do_derivation_from_text(user, source, text)

    def post(self, request, *args, **kwargs):

        user = request.user
        derivation_result = {}

        # file uploaded?
        if "txt_file" in request.FILES:
            serializer = self.txt_file_serializer_class(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)
            derivation_result = self._do_derivation_from_file(
                user,
                serializer.validated_data["source"],
                serializer.validated_data["txt_file"],
            )

        # text uploaded?
        elif "text" in request.data:
            serializer = self.text_serializer_class(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            derivation_result = self._do_derivation_from_text(
                user,
                serializer.validated_data["source"],
                serializer.validated_data["text"],
            )

        # neither; error
        else:
            return Response(
                {"detail": "텍스트 혹은 .txt 파일이 제공되지 않았습니다."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not DEBUG:
            return Response(
                {
                    "detail": f"{derivation_result['lemmas_written']}개의 예문이 추가되었습니다."
                },
                status.HTTP_201_CREATED,
            )
        else:
            return Response(derivation_result, status=status.HTTP_201_CREATED)
