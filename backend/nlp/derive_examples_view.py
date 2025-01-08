from rest_framework.views import APIView
from rest_framework import serializers, status
from rest_framework.response import Response
from nlp.korean_lemmatizer import KoreanLemmatizer


class DeriveExamplesFromTextValidator(serializers.Serializer):
    text = serializers.CharField(required=True, max_length=2000)


class DeriveExamplesFromFileValidator(serializers.Serializer):
    txt_file = serializers.FileField(required=True)


class DeriveExamplesFromTextView(APIView):

    text_serializer_class = DeriveExamplesFromTextValidator
    txt_file_serializer_class = DeriveExamplesFromFileValidator
    lemmatizer = KoreanLemmatizer(attach_다_to_verbs=True)

    def post(self, request):
        print(request.FILES)

        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)

        text = request.data["text"]

        print(self.lemmatizer.get_lemmas(text))

        return Response({"detail": "Added derived examples"}, status.HTTP_201_CREATED)
