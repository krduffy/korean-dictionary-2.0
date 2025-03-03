from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework import serializers, status
from rest_framework.permissions import IsAuthenticated

from korean.models import KoreanHeadword

from nlp.korean_lemmatizer import KoreanLemmatizer
from nlp.example_derivation_model.example_deriver import ExampleDeriver
from user_examples.models import DerivedExampleText, DerivedExampleLemma

from backend.settings import DEBUG
from nlp.example_derivation_model.types import (
    LEMMA_IGNORED,
    LEMMA_AMBIGUOUS,
    NO_KNOWN_HEADWORDS,
    LEMMA_ALREADY_DISAMBIGUATED,
)


class DeriveExamplesViewValidator(serializers.Serializer):
    text = serializers.CharField(required=False, max_length=2000)
    text_file = serializers.FileField(required=False)
    source = serializers.CharField(required=True, max_length=100)
    ignored_headwords = serializers.CharField(required=False, default="")
    image_url = serializers.ImageField(required=False)

    def to_internal_value(self, data):
        new_data = data.copy()

        if "text_file" in data and data["text_file"] == "null":
            new_data.pop("text_file")
        if "image_url" in data and data["image_url"] == "null":
            new_data.pop("image_url")

        return super().to_internal_value(new_data)

    def validate(self, data):
        if not data.get("text") and not data.get("text_file"):
            raise serializers.ValidationError("Text or a text file must be uploaded.")
        if data.get("text") and data.get("text_file"):
            raise serializers.ValidationError(
                "Text and a text file cannot both be uplaoded."
            )

        return data


class DeriveExamplesFromTextView(APIView):

    permission_classes = (IsAuthenticated,)

    serializer_class = DeriveExamplesViewValidator

    SAVE_BATCH_SIZE = 512

    lemmatizer = KoreanLemmatizer(attach_다_to_verbs=True)

    def _do_derivation_from_text(
        self, text, source, user, image_url, ignored_headwords
    ):
        new_det = DerivedExampleText(
            text=text,
            source=source,
            user_ref=user,
            image_url=image_url,
        )
        new_det.save()

        to_add = []

        num_ambiguous = 0
        num_ignored = 0
        num_no_known_headwords = 0
        num_already_disambiguated = 0

        example_deriver = ExampleDeriver()

        for derived_example in example_deriver.generate_examples_in_text(
            text, ignored_headwords
        ):

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
                        headword_ref=KoreanHeadword(pk=returned_pk),
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

    # @silk_profile(name="POST_DERIVE_EXAMPLES")
    def post(self, request, *args, **kwargs):

        user = request.user
        derivation_result = {}

        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        text = None

        # file uploaded?
        if serializer.validated_data.get("text_file"):
            text_file = serializer.validated_data["text_file"]
            all_bytes = text_file.read()
            text = all_bytes.decode("utf-8")
        elif serializer.validated_data.get("text"):
            text = serializer.validated_data["text"]

        if text is None:
            return JsonResponse(
                {"detail": "text unexpectedly none"},
                status=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

        derivation_result = self._do_derivation_from_text(
            text=text,
            source=serializer.validated_data["source"],
            user=user,
            image_url=serializer.validated_data.get(
                "image_url",
            ),
            ignored_headwords=serializer.validated_data["ignored_headwords"],
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
