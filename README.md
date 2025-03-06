# Korean Dictionary (2.0)

This is a refactor (rewrite) of my original Korean dictionary [here](https://github.com/krduffy/korean-dictionary).

## Goals

The primary goals of this project are in response to feedback from and observations of the first dictionary. These goals included making a more intuitive and responsive design, improving the appearance of the UI, rewriting everything in Typescript, and creating a mobile app version.

In addition, I wanted to add an LLM based system that would simplify the process of adding your own example sentences for a word. It would allow users to input only the text (eg wiki article or simple sentence) and allow the dictionary to automatically derive examples for relevant words, removing the need for manually pairing example words with sentences.

## Current Progress

The major functionalities (for the web application) are all complete. I will eventually return to make the mobile app but for the time being I will be using this version of the project and seeing which features are not ideal or need improvement.

## Relevant Repositories/Resources

I used Urimalsaem's data for the main dictionary data. For Hanja characters, the data comes from Namuwiki and makemeahanzi.
NLP functionality comes from python-mecab-ko (Mecab) and KoBERT.

#### Detailed Descriptions and Links

- [Urimalsaem (우리말샘)](https://opendict.korean.go.kr/main): Source of Korean word data. Largest Korean dictionary with > 1mil headwords.
- [Namuwiki (나무위키)](https://namu.wiki): Source of most Hanja character data.
- [Hanzi Writer](https://github.com/chanind/hanzi-writer): Good library for animating Hanja (Hanzi) characters' strokes.
- [makemeahanzi](https://github.com/skishore/makemeahanzi): Source of Hanja ideograph decompositions + many radicals.
- [python-mecab-ko](https://github.com/jonghwanhyeon/python-mecab-ko): Python wrapper for the Korean MeCab part of speech tagger.
- [KoBERT](https://github.com/SKTBrain/KoBERT): Korean language model for text embeddings.

## License

This project is licensed under the GNU General Public License v3.0 (GPL-3.0). See the [LICENSE](LICENSE) file for details.

This project uses various third-party resources and libraries, each with its own license:

- Data from Urimalsaem (우리말샘): [Creative Commons Attribution-NonCommercial-ShareAlike 2.0 Korea (CC BY-NC-SA 2.0 KR)](LICENSES/by-nc-sa-2.0-kr.txt)
- Data from Namuwiki (나무위키): [Creative Commons Attribution-NonCommercial-ShareAlike 2.0 Korea (CC BY-NC-SA 2.0 KR)](LICENSES/by-nc-sa-2.0-kr.txt)
- Hanzi Writer: [MIT License](LICENSES/mit.txt)
- Data from makemeahanzi: [GNU Lesser General Public License (LGPL)](LICENSES/lgpl.txt)

Please refer to each project's license for more details on their terms of use.
