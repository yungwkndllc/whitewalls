function getRandomHex() {
  const hex = Math.floor(R.random_dec() * 256).toString(16); // Generate a number between 0 and 255 and convert to hex
  return hex.length === 1 ? "0" + hex : hex; // Ensure it is 2 digits by adding a leading 0 if necessary
}
