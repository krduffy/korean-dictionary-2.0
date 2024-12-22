# Korean Dictionary (2.0)

This is a refactor (rewrite) of my original Korean dictionary [here](https://github.com/krduffy/korean-dictionary).

## Goals

The primary goals of this project are in response to feedback from and observations of the first dictionary. These goals include:

- to fix unintuitive and/or undiscoverable features, such as:
  - automatic conversion to the Korean keyboard when the English keyboard was used
  - the unexplained relationship between the dictionary windows/panels and why they exist
  - special sentinel characters in search terms instead of separate query parameters

- to improve the app's user experience by:
  - having more responsive design
  - having two dictionary windows be optional
  - changing the review system to have a simplified spaced repetition system instead of being as lightweight as the first

- add an LLM based system to simplify example sentence management
  - allow users to input only the text (eg books, subtitles) and allowing the dictionary to automatically derive example words for relevant words, removing the need for manually pairing example words with sentences

- to convert all Javascript to Typescript for better maintainability and type safety.

- to have a mobile app version.

## Current Progress

This is still a work in progress, but the functionality of searching for words and Hanja characters, adding and removing words to/from the known and studied lists, and toggling certain settings has been implemented. Search result order is also dependent on the known/studied lists of users.

The next step of development is adding user-added word examples, which will include example sentences, example images, and example videos. I also plan to allow the user to input texts that they have read, after which examples of various words will be automatically searched for in the text without their input (see "add an LLM based system" above). This will have to involve NLP and word sense disambiguation.

## License

This project is licensed under the GNU General Public License v3.0 (GPL-3.0). See the [LICENSE](LICENSE) file for details.

This project uses various third-party resources and libraries, each with its own license:

- Data from Urimalsaem (우리말샘): [Creative Commons Attribution-NonCommercial-ShareAlike 2.0 Korea (CC BY-NC-SA 2.0 KR)](LICENSES/by-nc-sa-2.0-kr.txt)
- Data from Namuwiki (나무위키): [Creative Commons Attribution-NonCommercial-ShareAlike 2.0 Korea (CC BY-NC-SA 2.0 KR)](LICENSES/by-nc-sa-2.0-kr.txt)
- Hanzi Writer: [MIT License](LICENSES/mit.txt)
- Data from makemeahanzi: [GNU Lesser General Public License (LGPL)](LICENSES/lgpl.txt)
- konlpy: [GNU General Public License (GPL)](LICENSES/gpl.txt)

Please refer to each project's license for more details on their terms of use.
