from rest_framework.views import APIView
from rest_framework import serializers, status
from rest_framework.response import Response

from nlp.korean_lemmatizer import KoreanLemmatizer
from nlp.example_derivation_model.example_deriver import ExampleDeriver


class DeriveExamplesFromTextValidator(serializers.Serializer):
    text = serializers.CharField(required=True, max_length=2000)


class DeriveExamplesFromFileValidator(serializers.Serializer):
    txt_file = serializers.FileField(required=True)


class DeriveExamplesFromTextView(APIView):

    text_serializer_class = DeriveExamplesFromTextValidator
    txt_file_serializer_class = DeriveExamplesFromFileValidator
    lemmatizer = KoreanLemmatizer(attach_다_to_verbs=True)
    example_deriver = ExampleDeriver()

    def post(self, request):
        # file uploaded?

        if "txt_file" in request.FILES:
            serializer = self.txt_file_serializer_class(data=request.FILES)
            if not serializer.is_valid():
                return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)
            self.example_deriver.derive_examples_from_file(
                serializer.validated_data["txt_file"]
            )

        # text uploaded?
        elif "text" in request.data:
            serializer = self.text_serializer_class(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            text = serializer.validated_data["text"]
            self.example_deriver.derive_examples_from_text(text)

        # neither; error
        else:
            return Response(
                {"detail": "텍스트 혹은 .txt 파일이 제공되지 않았습니다."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response({"detail": "예문이 추가되었습니다."}, status.HTTP_201_CREATED)
