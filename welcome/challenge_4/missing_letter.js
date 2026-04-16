function missing(array) {
  for (let i = 0; i < array.length - 1; i++) {
    const letterNumber = array[i].charCodeAt(0);
    const nextLetterNumber = array[i + 1].charCodeAt(0);
    if (nextLetterNumber !== letterNumber + 1) {
      return String.fromCharCode(letterNumber + 1);
    }
  }
}

console.log(missing(["a", "b", "c", "d", "f"]));
console.log(missing(["O", "Q", "R", "S"]));
