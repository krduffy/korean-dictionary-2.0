# Generated by Django 5.1.2 on 2024-10-24 02:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('words', '0002_hanjameaningreading'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='hanjacharacter',
            name='meaning_reading',
        ),
        migrations.RemoveField(
            model_name='hanjameaningreading',
            name='reading',
        ),
        migrations.AddField(
            model_name='hanjameaningreading',
            name='readings',
            field=models.CharField(max_length=3, null=True),
        ),
    ]
