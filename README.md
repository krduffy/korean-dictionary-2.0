key points

feedback on 1.0

- why 2 panels ?
- many features are not obvious at all and require hinting or prompting.
  => mainly the point of adding words to known
  => also eng=>kor keyboard mapper
  => manipulating a panel from the other panel to cross reference definitions

personal insights from usage after completion

- review implementation was meant to be lightweight and without hassle or temporal stress like anki or other srs systems but in practice was really bad (spaced repetition / at least removing words from list to be studied is nonnegotiable)
- writing in js not ts is bad for pretty much everything involved in development
- hanja game is not fun and in practice was boring.
  the ways to have personalized review experiences beyond outright
  going through a list of words needs to be made better and better thought out.
  adding large features that will take a decent amount of time without thinking them through first does not work out because that hanja game generator
  wasted so much time for a bad feature
- if it is going to make future development easier, change things that will require
  large refactors asap because it only gets worse the longer you wait.
