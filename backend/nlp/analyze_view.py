from rest_framework.views import APIView
from rest_framework import serializers, status
from rest_framework.response import Response

from nlp.find_lemma import find_lemma

from konlpy.tag import Kkma

kkma = Kkma()


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
    mouse_over = serializers.CharField(required=True, max_length=100)


class KoreanWordAnalyze(APIView):
    """
    API view to return the lemma for a given word in a given text. Can also return an incorrect lemma.

    POST body keys:
      - `text`: The full text.
      - `mouse_over`: The word from text whose lemma should be returned.

    Returns:
      A JSON dictionary containing:

      On Success:
        - `found`: The lemma corresponding to `mouse_over`.
        - `num_words`: The number of words the model found in `text`.
        - `analysis`: All of the lemmas the model found in `text`.

      On Failure:
        - `error`: The encountered error.
    """

    serializer_class = NLPRequestValidator

    def post(self, request):

        # i have tried to test this with fuzz testing thousands of strings but
        # the jvm kkma uses will not work in the test. no idea what the problem is
        # tried mutexes, using separate tests instead of subtest, forcing sleep() between
        # tests, ...
        # ??
        # for now the entire operation is wrapped in try catch but this post view
        # will likely need to be a privileged access point
        # i believe the problem is not related to spamming the post view but rather reinstantiating
        # kkma which under the hood inits the jvm. also tried making a single Kkma() instance
        # and passing it into find_lemma, but that also did not work and leads to garbage collector
        # exceptions, null pointer, .. so maybe not
        try:
            serializer = self.serializer_class(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            sentence = request.data["sentence"]
            mouse_over = request.data["mouse_over"]

            lemma = find_lemma(
                sentence=sentence, mouse_over=mouse_over, kkma_instance=kkma
            )
            if lemma:
                return get_found_response(lemma)

            return get_failure_response()
        except:
            return get_error_response()
