# Generated by Django 5.1.2 on 2024-10-24 02:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('words', '0004_alter_hanjameaningreading_readings'),
    ]

    operations = [
        migrations.AlterField(
            model_name='hanjameaningreading',
            name='meaning',
            field=models.CharField(max_length=100),
        ),
    ]
