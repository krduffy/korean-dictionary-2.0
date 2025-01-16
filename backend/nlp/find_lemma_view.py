from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework import serializers, status
from rest_framework.response import Response
from nlp.korean_lemmatizer import KoreanLemmatizer


def get_found_response(found_word):
    return Response({"found": found_word}, status=status.HTTP_200_OK)


def get_failure_response():
    return Response(
        {"detail": "A word was not found."}, status=status.HTTP_404_NOT_FOUND
    )


def get_error_response():
    return Response(
        {"detail": "An error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
    )


class NLPRequestValidator(serializers.Serializer):
    sentence = serializers.CharField(required=True, max_length=500)
    index = serializers.IntegerField(required=True)
    mouse_over = serializers.CharField(required=True, max_length=100)


class FindLemmaInStringView(APIView):
    """
    API view to return the lemma for a given word in a given text. Can also return an incorrect lemma.

    POST body keys:
      - `text`: The full text.
      - `index`: The index of the token that was moused over.
      - `mouse_over`: The word from text whose lemma should be returned.

    Returns:
      A JSON dictionary containing:

      On Success:
        - `found`: The lemma corresponding to `mouse_over`.

      On Failure:
        - `error`: The encountered error.
    """

    serializer_class = NLPRequestValidator
    lemmatizer = KoreanLemmatizer(attach_다_to_verbs=True)

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        sentence = serializer.validated_data["sentence"]
        index = serializer.validated_data["index"]
        mouse_over = serializer.validated_data["mouse_over"]

        try:
            lemma = self.lemmatizer.get_lemma_at_index(sentence, index, mouse_over)
            return get_found_response(lemma)
        except IndexError:
            return JsonResponse(
                {
                    "detail": "제공한 index가 0에 불과하거나 문장의 어절 수를 초과합니다."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
