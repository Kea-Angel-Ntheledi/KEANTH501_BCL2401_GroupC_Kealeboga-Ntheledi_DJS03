class BookPreview extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    connectedCallback() {
      const author = this.getAttribute('author');
      const id = this.getAttribute('data-preview');
      const image = this.getAttribute('image');
      const title = this.getAttribute('title');
  
      this.shadowRoot.innerHTML = `
        <style>
          .preview {
            display: flex;
            flex-direction: column;
            border: 1px solid #ccc;
            padding: 10px;
            cursor: pointer;
          }
          .preview__image {
            width: 100%;
            height: auto;
          }
          .preview__info {
            margin-top: 10px;
          }
          .preview__title {
            font-size: 1.2em;
            margin: 0;
          }
          .preview__author {
            color: #555;
          }
        </style>
        <button class="preview" data-preview="${id}">
          <img class="preview__image" src="${image}" />
          <div class="preview__info">
            <h3 class="preview__title">${title}</h3>
            <div class="preview__author">${author}</div>
          </div>
        </button>
      `;
    }
  }
  
  customElements.define('book-preview', BookPreview);
  