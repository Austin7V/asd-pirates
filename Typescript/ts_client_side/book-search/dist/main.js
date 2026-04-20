"use strict";
const searchForm = document.getElementById("search-form");
const bookList = document.getElementById("book-list");
searchForm.addEventListener("submit", (event) => {
    event?.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const query = formData.get("query");
    console.log(query);
});
//# sourceMappingURL=main.js.map