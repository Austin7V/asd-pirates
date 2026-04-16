function order(words) {
  if (words === "") {
    return "";
  }
  const wordsSplit = words.split(" ");
  wordsSplit.sort((a, b) => {
    const numberA = a.match(/\d/)[0];
    const numberB = b.match(/\d/)[0];

    return numberA - numberB;
  });
  return wordsSplit.join(" ");
}
console.log(order("is2 Thi1s T4est 3a"));
console.log(order("4of Fo1r pe6ople g3ood th5e the2"));
console.log(order(""));
