function mask(text) {
  //als erstes prüfen ob der text 4 teichen hat oder kürzer ist wenn nicht dann gibts nicht zu marklieren!
  if (text.length <= 4) {
    return text;
  }
  const hiddeLength = text.length - 4;
  const maskPart = "#".repeat(hiddeLength);
  const visiblePart = text.slice(-4);

  return maskPart + visiblePart;
}

console.log(mask("23425246534634636"));
console.log(mask("234242424"));
console.log(mask("2"));
console.log(mask(""));

console.log(mask("Skippy"));
console.log(mask("ONfosnognsongon Pirates!"));
