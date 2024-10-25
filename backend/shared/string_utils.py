def is_hanja(char: str) -> bool:
  """
    Returns true if the first character of char is a hanja character in the CJK Unified Ideograph
    Unicode block, or false otherwise.
  """
  # CJK Unified Ideograph range from 0x4e00 to 0x9fff
  return 0x4e00 <= ord(char) <= 0x9fff

