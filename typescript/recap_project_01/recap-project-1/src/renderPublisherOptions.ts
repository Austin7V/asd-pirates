import type {Book} from "./types";

export function renderPublisherOptions(
    books: Book[],
    publisherSelect: HTMLSelectElement | null = document.querySelector("#publisher-select"),) {

    if (!publisherSelect) {
        return;
    }
    publisherSelect.innerHTML = "";

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "All Publishers";
    publisherSelect.append(defaultOption);

    const publishers: string[]=[];

    for(const book of books) {
        if (!publishers.includes(book.publisher)) {
            publishers.push(book.publisher);
        }
    }
    for (const publisher of publishers) {
        const option = document.createElement("option");
        option.value = publisher;
        option.textContent = publisher;
        publisherSelect.append(option);
    }

}
