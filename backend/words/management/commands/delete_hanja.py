from django.core.management.base import BaseCommand, no_translations
from words.models import HanjaCharacter
import django

django.setup()

class Command(BaseCommand):

  def add_arguments(self, parser):
    parser.add_argument('fname', type=str, help='Path to a file with a single hanja character on each line.')

  @no_translations
  def handle(self, *args, **kwargs):

    # usually,
    # fname = "words\\management\\dictionary_data\\hanja\\redirects.txt"
    fname = kwargs['fname']
    
    fname = "api\\management\\dict_files\\redirects.txt"

    deleted = 0
    with open(fname, 'r', encoding='utf-8') as file:

      for line in file:
        character = line[0]
        
        if HanjaCharacter.objects.filter(character = character).exists():
          HanjaCharacter.objects.filter(character=character).delete()
          deleted += 1
      
    self.stdout.write(self.style.SUCCESS(f'Finished reading file; deleted {deleted} characters'))