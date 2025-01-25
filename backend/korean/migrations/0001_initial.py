# Generated by Django 5.1.2 on 2025-01-25 19:25

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="KoreanHeadword",
            fields=[
                ("target_code", models.IntegerField(primary_key=True, serialize=False)),
                ("word", models.CharField(db_index=True, max_length=100)),
                ("origin", models.CharField(max_length=100, null=True)),
                ("word_type", models.CharField(max_length=3, null=True)),
                ("history_info", models.JSONField(default=None, null=True)),
                ("result_ranking", models.SmallIntegerField(default=0)),
            ],
            options={
                "indexes": [
                    models.Index(fields=["word"], name="index_korean_word_word")
                ],
            },
        ),
        migrations.CreateModel(
            name="Sense",
            fields=[
                ("target_code", models.IntegerField(primary_key=True, serialize=False)),
                ("definition", models.CharField(max_length=1500)),
                ("type", models.CharField(max_length=3, null=True)),
                ("order", models.SmallIntegerField()),
                ("category", models.CharField(max_length=6, null=True)),
                ("pos", models.CharField(max_length=6, null=True)),
                ("additional_info", models.JSONField(default=None, null=True)),
                (
                    "word_ref",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="senses",
                        to="korean.koreanheadword",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="SenseExample",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("example", models.CharField()),
                ("source", models.CharField(null=True)),
                ("translation", models.CharField(null=True)),
                ("origin", models.CharField(null=True)),
                ("region", models.CharField(null=True)),
                (
                    "sense_ref",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="examples",
                        to="korean.sense",
                    ),
                ),
            ],
        ),
    ]
