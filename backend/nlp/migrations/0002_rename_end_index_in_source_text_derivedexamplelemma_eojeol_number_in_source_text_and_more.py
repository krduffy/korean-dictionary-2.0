# Generated by Django 5.1.2 on 2025-01-17 23:20

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("nlp", "0001_initial"),
    ]

    operations = [
        migrations.RenameField(
            model_name="derivedexamplelemma",
            old_name="end_index_in_source_text",
            new_name="eojeol_number_in_source_text",
        ),
        migrations.RemoveField(
            model_name="derivedexamplelemma",
            name="start_index_in_source_text",
        ),
    ]
