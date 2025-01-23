# Generated by Django 5.1.2 on 2025-01-23 14:32

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0001_initial"),
        ("words", "0009_koreanword_result_ranking"),
    ]

    operations = [
        migrations.RenameField(
            model_name="userimage",
            old_name="note_image",
            new_name="image",
        ),
        migrations.RemoveField(
            model_name="userexamplesentence",
            name="creator",
        ),
        migrations.RemoveField(
            model_name="userexamplesentence",
            name="order",
        ),
        migrations.RemoveField(
            model_name="userimage",
            name="creator",
        ),
        migrations.RemoveField(
            model_name="userimage",
            name="note_text",
        ),
        migrations.RemoveField(
            model_name="userimage",
            name="order",
        ),
        migrations.AddField(
            model_name="userexamplesentence",
            name="user_ref",
            field=models.ForeignKey(
                default=None,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="added_sentences",
                to=settings.AUTH_USER_MODEL,
            ),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="userimage",
            name="image_accompanying_text",
            field=models.CharField(null=True),
        ),
        migrations.AddField(
            model_name="userimage",
            name="source",
            field=models.CharField(default=None, max_length=1000),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="userimage",
            name="user_ref",
            field=models.ForeignKey(
                default=None,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="added_images",
                to=settings.AUTH_USER_MODEL,
            ),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name="userexamplesentence",
            name="source",
            field=models.CharField(default="", max_length=1000),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name="userimage",
            name="word_ref",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="user_images",
                to="words.koreanword",
            ),
        ),
        migrations.CreateModel(
            name="UserVideoExample",
            fields=[
                ("id", models.BigAutoField(primary_key=True, serialize=False)),
                ("video_url", models.URLField()),
                ("time", models.IntegerField(null=True)),
                ("video_text", models.CharField(null=True)),
                ("source", models.CharField(max_length=1000)),
                (
                    "user_ref",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="added_videos",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "word_ref",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="user_videos",
                        to="words.koreanword",
                    ),
                ),
            ],
        ),
    ]
