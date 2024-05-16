import { books, authors, genres, BOOKS_PER_PAGE } from './data.js'

//initialize page and matches
let page = 1;
let matches = books

//Create document fragment for initial book rendering
const starting = document.createDocumentFragment()

//Loop through initial books and create HTML  elements
for (const { author, id, image, title } of matches.slice(0, BOOKS_PER_PAGE)) {
    const element = document.createElement('button')
    element.classList = 'preview'
    element.setAttribute('data-preview', id)

    //Construct HTML content for each book
    element.innerHTML = `
        <img
            class="preview__image"
            src="${image}"
        />
        
        <div class="preview__info">
            <h3 class="preview__title">${title}</h3>
            <div class="preview__author">${authors[author]}</div>
        </div>
    `

    starting.appendChild(element)
} 

//Append initial book elements to the DOM
document.querySelector('[data-list-items]').appendChild(starting)

//Populate genres dropdown
const genreHtml = document.createDocumentFragment();
const firstGenreElement = document.createElement("option");
firstGenreElement.value = "any";
firstGenreElement.innerText = "All Genres";
genreHtml.appendChild(firstGenreElement);

Object.keys(genres).forEach((id) => {
  const name = genres[id];
  const element = document.createElement("option");
  element.value = id;
  element.innerText = name;
  genreHtml.appendChild(element);
});

document.querySelector('[data-search-genres]').appendChild(genreHtml)

//Populate authors dropdown
const authorsHtml = document.createDocumentFragment();
const firstAuthorElement = document.createElement("option");
firstAuthorElement.value = "any";
firstAuthorElement.innerText = "All Authors";
authorsHtml.appendChild(firstAuthorElement);

Object.keys(authors).forEach((id) => {
  const name = authors[id];
  const element = document.createElement("option");
  element.value = id;
  element.innerText = name;
  authorsHtml.appendChild(element);
});

document.querySelector('[data-search-authors]').appendChild(authorsHtml)

//Set theme based on system preference
const themeValue =
  window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "night"
    : "day";

document.querySelector("[data-settings-theme]").value = themeValue;
document.documentElement.style.setProperty(
  "--color-dark",
  themeValue === "night" ? "255, 255, 255" : "10, 10, 20"
);
document.documentElement.style.setProperty(
  "--color-light",
  themeValue === "night" ? "10, 10, 20" : "255, 255, 255"
);


//Set initial button text and state
const listButton = document.querySelector("[data-list-button]");
const remainingBooks = matches.length - page * BOOKS_PER_PAGE;
const remainingText = remainingBooks > 0 ? ` (${remainingBooks})` : "";

listButton.innerHTML = `
    <span>Show more</span>
    <span class="list__remaining">${remainingText}</span>
`;

listButton.disabled = remainingBooks <= 0;

//Handle cancel button clicks
function handleCancelClick(cancelSelector, overlaySelector) {
  document.querySelector(cancelSelector).addEventListener("click", () => {
    document.querySelector(overlaySelector).open = false;
  });
}

handleCancelClick("[data-search-cancel]", "[data-search-overlay]");
handleCancelClick("[data-settings-cancel]", "[data-settings-overlay]");
handleCancelClick("[data-list-close]", "[data-list-active]");

document.querySelector("[data-header-search]").addEventListener("click", () => {
  document.querySelector("[data-search-overlay]").open = true;
  document.querySelector("[data-search-title]").focus();
});

document
  .querySelector("[data-header-settings]")
  .addEventListener("click", () => {
    document.querySelector("[data-settings-overlay]").open = true;
  });

//Handle settings form submission
document
  .querySelector("[data-settings-form]")
  .addEventListener("submit", (event) => {
    event.preventDefault();

    const theme = document.querySelector('[name="theme"]').value;

    // Set theme based on user selection
    if (theme === "night") {
      document.documentElement.style.setProperty(
        "--color-dark",
        "255, 255, 255"
      );
      document.documentElement.style.setProperty("--color-light", "10, 10, 20");
    } else {
      document.documentElement.style.setProperty("--color-dark", "10, 10, 20");
      document.documentElement.style.setProperty(
        "--color-light",
        "255, 255, 255"
      );
    }

    // Close settings overlay
    document.querySelector("[data-settings-overlay]").open = false;
  });


//Handle search form submission
document.querySelector('[data-search-form]').addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const filters = Object.fromEntries(formData)
    const result = []

    //Filter books based on search criteria
    for (const book of books) {
        let genreMatch = filters.genre === 'any'

        for (const singleGenre of book.genres) {
            if (genreMatch) break;
            if (singleGenre === filters.genre) { genreMatch = true }
        }

        if (
            (filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase())) && 
            (filters.author === 'any' || book.author === filters.author) && 
            genreMatch
        ) {
            result.push(book)
        }
    }

    //Update matched and render new books
    page = 1;
    matches = result

    if (result.length < 1) {
        document.querySelector('[data-list-message]').classList.add('list__message_show')
    } else {
        document.querySelector('[data-list-message]').classList.remove('list__message_show')
    }

    document.querySelector('[data-list-items]').innerHTML = ''
    const newItems = document.createDocumentFragment()

    for (const { author, id, image, title } of result.slice(0, BOOKS_PER_PAGE)) {
        const element = document.createElement('button')
        element.classList = 'preview'
        element.setAttribute('data-preview', id)
    
        element.innerHTML = `
            <img
                class="preview__image"
                src="${image}"
            />
            
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]}</div>
            </div>
        `

        newItems.appendChild(element)
    }

    document.querySelector('[data-list-items]').appendChild(newItems)
    document.querySelector('[data-list-button]').disabled = (matches.length - (page * BOOKS_PER_PAGE)) < 1

    document.querySelector('[data-list-button]').innerHTML = `
        <span>Show more</span>
        <span class="list__remaining"> (${(matches.length - (page * BOOKS_PER_PAGE)) > 0 ? (matches.length - (page * BOOKS_PER_PAGE)) : 0})</span>
    `

    window.scrollTo({top: 0, behavior: 'smooth'});
    document.querySelector('[data-search-overlay]').open = false
})

//Handle "show more" button click
document.querySelector('[data-list-button]').addEventListener('click', () => {
    const fragment = document.createDocumentFragment()

    for (const { author, id, image, title } of matches.slice(page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE)) {
        const element = document.createElement('button')
        element.classList = 'preview'
        element.setAttribute('data-preview', id)
    
        element.innerHTML = `
            <img
                class="preview__image"
                src="${image}"
            />
            
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]}</div>
            </div>
        `

        fragment.appendChild(element)
    }

    document.querySelector('[data-list-items]').appendChild(fragment)
    page += 1
})

//Handle  book preview click
document.querySelector('[data-list-items]').addEventListener('click', (event) => {
    const pathArray = Array.from(event.path || event.composedPath())
    let active = null

    for (const node of pathArray) {
        if (active) break

        if (node?.dataset?.preview) {
            let result = null
    
            for (const singleBook of books) {
                if (result) break;
                if (singleBook.id === node?.dataset?.preview) result = singleBook
            } 
        
            active = result
        }
    }
    
    if (active) {
        document.querySelector('[data-list-active]').open = true
        document.querySelector('[data-list-blur]').src = active.image
        document.querySelector('[data-list-image]').src = active.image
        document.querySelector('[data-list-title]').innerText = active.title
        document.querySelector('[data-list-subtitle]').innerText = `${authors[active.author]} (${new Date(active.published).getFullYear()})`
        document.querySelector('[data-list-description]').innerText = active.description
    }
})