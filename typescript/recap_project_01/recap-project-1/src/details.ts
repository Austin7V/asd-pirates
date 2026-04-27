const searchParams = new URLSearchParams(window.location.search);
const bookId = searchParams.get("id");
console.log("Id from book:", bookId);