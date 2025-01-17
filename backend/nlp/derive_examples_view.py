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
            self.example_deriver.derive_examples(request.FILES["txt_file"])

        # text uploaded?
        elif "text" in request.data:
            serializer = self.text_serializer_class(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            text = request.data["text"]

        # neither; error
        else:
            return Response(
                {"detail": "A .txt file or raw text was not correctly provided."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response({"detail": "Added derived examples"}, status.HTTP_201_CREATED)
