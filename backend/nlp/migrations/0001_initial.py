# Generated by Django 5.1.2 on 2025-01-08 16:13

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("words", "0006_alter_hanjameaningreading_readings"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="DerivedExampleText",
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
                ("text", models.TextField()),
                ("source", models.CharField()),
                (
                    "user_that_added",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="derived_example_texts",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="DerivedExampleLemma",
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
                ("lemma", models.CharField()),
                ("start_index_in_source_text", models.IntegerField()),
                ("end_index_in_source_text", models.IntegerField()),
                (
                    "word_ref",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        to="words.koreanword",
                    ),
                ),
                (
                    "source_text",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="derived_example_lemmas",
                        to="nlp.derivedexampletext",
                    ),
                ),
            ],
        ),
    ]