import { LitElement, css, html } from 'https://unpkg.com/lit-element@2.2.1/lit-element.js?module'

// https://ebible.org/bible/gbf.htm - these aren't proper HTML tags, but
// rendering the text as HTML seems to prevent them from showing up in the output
// @todo - investigate this further
import { unsafeHTML } from 'https://unpkg.com/lit-html@1.1.2/directives/unsafe-html.js?module';
import { until } from 'https://unpkg.com/lit-html@1.1.2/directives/until.js?module'
import { Loading } from './loading.js'

const Template = ({ hasReference, hasVerse, isBlock, name, text, verse }) => {
  return isBlock
    ? html`
      <article>
        ${hasReference ? html`<h1 class="reference">${name}</h1>` : ''}
        <article>
          ${
            hasVerse
              ? html`<span>(${verse}) <span class="text">${unsafeHTML(text)}</span></span>`
              : html`<span class="text">${text}</span>`
          }
        </article>
      </article>
    `
    : html`
      ${hasReference ? html`<span class="reference">${name}</span>` : ''}
      ${hasVerse ? html`<span>(${verse})</span>` : ''}
      <span class="text">${unsafeHTML(text)}</span>
    `
}

export const BibleToolsSingleVerse = class extends LitElement {
  static get properties() {
    return {
      book: {
        type: String
      },
      chapter: {
        type: String
      },
      hasReference: {
        type: Boolean
      },
      hasVerse: {
        type: Boolean
      },
      host: {
        type: String
      },
      isBlock: {
        type: Boolean
      },
      language: {
        type: String
      },
      translation: {
        type: String
      },
      verse: {
        type: String
      },
    }
  }

  static get styles() {
    return css`
      :host {
        color: var(--bible-tools-single-verse-color, #000);
      }

      article h1.reference {
        color: var(--bible-tools-single-verse-reference-color);
        font: var(--bible-tools-single-verse-reference-font, bold 1.5rem sans-serif);
      }

      span.reference {
        color: var(--bible-tools-single-verse-reference-color);
        font: var(--bible-tools-single-verse-reference-font, normal 1rem sans-serif);
      }

      article > p.text {
        color: var(--bible-tools-single-verse-text-color);
        font: var(--bible-tools-single-verse-text-font, normal 1rem sans-serif);
      }

      span.text {
        color: var(--bible-tools-single-verse-text-color);
        font: var(--bible-tools-single-verse-text-font, normal 1rem sans-serif);
      }
    `
  }

  constructor() {
    super()

    this.hasReference = false
    this.hasVerse = false
    this.isBlock = false

    this.book="John"
    this.chapter="3"
    this.host="https://bible-tools.github.io/data/translations"
    this.language="en"
    this.translation="KJV"
    this.verse="16"
  }

  render() {
    const url = this.host + '/' + this.language + '/' +
      this.translation + '/' + this.book + '/' + this.chapter +
      '/' + this.verse + '/index.json'

    return html`
      ${until(fetch(url).then(res => {
        if (res.ok) {
          return res.json().then(json => Template({
            hasReference: this.hasReference,
            hasVerse: this.hasVerse,
            isBlock: this.isBlock,
            ...json
          }))
        }
      }), Loading(this.isBlock))}
    `
  }
}

if (!customElements.get('bible-tools-single-verse')) {
  customElements.define('bible-tools-single-verse', BibleToolsSingleVerse)
}
