export function generateRandomID() {
  const getRandomLetter = () => String.fromCharCode(Math.floor(Math.random() * 26) + 65);
  const getRandomDigit = () => Math.floor(Math.random() * 10);
  const letters = getRandomLetter() + getRandomLetter();
  const digits = `${getRandomDigit()}${getRandomDigit()}${getRandomDigit()}${getRandomDigit()}`;
  const randomID = letters + digits;
  return randomID;
}
