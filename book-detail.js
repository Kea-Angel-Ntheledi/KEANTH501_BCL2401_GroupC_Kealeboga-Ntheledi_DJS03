class BookDetail extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    connectedCallback() {
      const image = this.getAttribute('image');
      const title = this.getAttribute('title');
      const subtitle = this.getAttribute('subtitle');
      const description = this.getAttribute('description');
  
      this.shadowRoot.innerHTML = `
        <style>
          .detail-overlay {
            display: flex;
            flex-direction: column;
            background: rgba(255, 255, 255, 0.9);
            padding: 20px;
            border-radius: 10px;
          }
          .detail-overlay img {
            width: 100%;
            height: auto;
          }
          .detail-overlay h2 {
            margin: 10px 0;
          }
          .detail-overlay p {
            color: #333;
          }
        </style>
        <div class="detail-overlay">
          <img src="${image}" />
          <h2>${title}</h2>
          <h3>${subtitle}</h3>
          <p>${description}</p>
        </div>
      `;
    }
  }
  
  customElements.define('book-detail', BookDetail);
  