# Generated by Django 5.1.2 on 2025-01-23 15:59

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0002_rename_note_image_userimage_image_and_more"),
    ]

    operations = [
        migrations.RenameField(
            model_name="userimage",
            old_name="image",
            new_name="image_url",
        ),
    ]
