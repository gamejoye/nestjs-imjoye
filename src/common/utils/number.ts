export function canTransformToInt(str: string) {
  if (
    str.length > 0 &&
    str.split('').every((char) => '0' <= char && char <= '9')
  ) {
    return true;
  }
  return false;
}
