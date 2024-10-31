from django.core.management import call_command
import django
import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

call_command(
    "runserver_plus",
    "--cert-file",
    "certs/server.crt",
    "--key-file",
    "certs/server.key",
)
