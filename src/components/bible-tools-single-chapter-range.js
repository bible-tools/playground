import { LitElement, css, html } from 'https://unpkg.com/lit-element@2.2.1/lit-element.js?module'

export const BibleToolsSingleChapterRange = class extends LitElement {
  static get properties() {
    return {
      book: {
        type: String
      },
      endverse: {
        type: String
      },
      isBlock: {
        type: Boolean
      },
      hasReference: {
        type: Boolean
      },
      hasVerses: {
        type: Boolean
      },
      chapter: {
        type: String
      },
      startverse: {
        type: String
      },
    }
  }

  static get styles() {
    return css`
      :host {
        color: var(--bible-tools-single-chapter-range-color, #000);
      }

      article h1.reference {
        color: var(--bible-tools-single-chapter-range-reference-color);
        font: var(--bible-tools-single-chapter-range-reference-font, bold 1.5rem sans-serif);
      }

      span.reference {
        color: var(--bible-tools-single-chapter-range-reference-color);
        font: var(--bible-tools-single-chapter-range-reference-font, normal 1rem sans-serif);
      }
    `
  }

  constructor() {
    super()

    this.hasReference = false
    this.hasVerses = false
    this.isBlock = false

    this.book = ''
    this.endverse = ''
    this.chapter = ''
    this.startverse = ''
  }

  get verserange() {
    let result = []

    for (let i=Number(this.startverse); i <= Number(this.endverse); i++) {
      result.push(i)
    }

    return result
  }

  displayReference() {
    if (this.hasReference) {
      return this.isBlock
        ? html`<h1 class="reference">${this.book}&nbsp;${this.chapter}:${this.startverse}-${this.endverse}</h1>`
        : html`<span class="reference">${this.book}&nbsp;${this.chapter}:${this.startverse}-${this.endverse}</span>`
    }

    return ''
  }

  render() {
    return html`
      ${this.displayReference()}
      ${this.verserange.map(verse => {
        return html`
          <bible-tools-single-verse
            ?isBlock=${this.isBlock}
            ?hasVerse=${this.hasVerses}
            book=${this.book}
            chapter=${this.chapter}
            verse=${verse}
          ></bible-tools-single-verse>
        `
      })}
    `
  }
}

if (!customElements.get('bible-tools-single-chapter-range')) {
  customElements.define('bible-tools-single-chapter-range', BibleToolsSingleChapterRange)
}
