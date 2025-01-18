from rest_framework.views import APIView
from rest_framework import serializers, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from words.models import KoreanWord

from nlp.korean_lemmatizer import KoreanLemmatizer
from nlp.example_derivation_model.example_deriver import ExampleDeriver
from nlp.models import DerivedExampleText, DerivedExampleLemma


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
        new_det = DerivedExampleText(text=text, source=source, user_that_added=user)
        new_det.save()

        to_add = []

        for derived_example in self.example_deriver.generate_examples_in_text(text):

            word_ref = None
            if derived_example["headword_pk"] is not None:
                try:
                    word_ref = KoreanWord.objects.get(pk=derived_example["headword_pk"])
                except KoreanWord.DoesNotExist:
                    pass
                    # word_ref still none

            to_add.append(
                DerivedExampleLemma(
                    source_text=new_det,
                    lemma=derived_example["lemma"],
                    word_ref=word_ref,
                    eojeol_number_in_source_text=derived_example["eojeol_num"],
                )
            )

        created = DerivedExampleLemma.objects.bulk_create(
            to_add, batch_size=self.SAVE_BATCH_SIZE
        )
        return len(created)

    def _do_derivation_from_file(self, user, source, in_memory_uploaded_file) -> int:
        all_bytes = in_memory_uploaded_file.read()
        text = all_bytes.decode("utf-8")

        return self._do_derivation_from_text(user, source, text)

    def post(self, request, *args, **kwargs):

        user = request.user
        num_created = 0

        # file uploaded?
        if "txt_file" in request.FILES:
            serializer = self.txt_file_serializer_class(data=request.FILES)
            if not serializer.is_valid():
                return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)
            num_created = self._do_derivation_from_file(
                user,
                serializer.validated_data["source"],
                serializer.validated_data["txt_file"],
            )

        # text uploaded?
        elif "text" in request.data:
            serializer = self.text_serializer_class(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            num_created = self._do_derivation_from_text(
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

        return Response(
            {"detail": f"{num_created}개의 예문이 추가되었습니다."},
            status.HTTP_201_CREATED,
        )
