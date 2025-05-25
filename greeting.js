// import { LitElement, html, css } from 'https://unpkg.com/lit@2/index.js?module';

// class UserGreeting extends LitElement {
//   static properties = {
//     name: { type: String }
//   };

//   constructor() {
//     super();
//     this.name = 'Mike';
//   }

//   static styles = css`
//     p { font-size: 1.2rem; }
//     button { margin-top: 10px; }
//   `;

//   updateName() {
//     this.name = 'Ada'; // Reassign triggers re-render
//   }

//   render() {
//     return html`
//       <p>Hello, ${this.name}!</p>
//       <button @click=${this.updateName}>Change Name</button>
//     `;
//   }
// }

// customElements.define('user-greeting', UserGreeting);

import { LitElement, html, css } from 'https://unpkg.com/lit@2/index.js?module';

class UserGreeting extends LitElement {
  static properties = {
    name: { type: String }
  };

  constructor() {
    super();
    this.name = 'Mike';
  }

  static styles = css`
    p {
      font-size: 1.2rem;
      color: darkslategray;
    }
    input {
      padding: 0.4rem;
      font-size: 1rem;
      margin-top: 10px;
      display: block;
    }
  `;

  handleInput(e) {
    this.name = e.target.value;
  }

  render() {
    return html`
      <p>Hello, ${this.name}!</p>
      <input
        type="text"
        .value=${this.name}
        @input=${this.handleInput}
        placeholder="Enter a name"
      />
    `;
  }
}

customElements.define('user-greeting', UserGreeting);