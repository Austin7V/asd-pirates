const searchForm = document.getElementById("search-form")as HTMLFormElement;
const bookList = document.getElementById("book-list")as HTMLUListElement;

searchForm.addEventListener("submit", (event: SubmitEvent) => {
    event?.preventDefault()
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const query = formData.get("query");

    console.log(query);
})
