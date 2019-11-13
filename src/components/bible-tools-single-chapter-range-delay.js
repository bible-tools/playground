import { LitElement, css, html } from 'https://unpkg.com/lit-element@2.2.1/lit-element.js?module'
import { asyncAppend } from 'https://unpkg.com/lit-html@1.1.2/directives/async-append.js?module'

import { waitPromise } from './utils.js'

async function* bibleToolsSingleVerseDelay({
  book,
  chapter,
  delay,
  hasVerse,
  isBlock,
  verserange
}) {
  for (let i = 0; i < verserange.length; i++) {
    yield html`
      <bible-tools-single-verse
        ?isBlock=${isBlock}
        ?hasVerse=${hasVerse}
        book=${book}
        chapter=${chapter}
        verse=${verserange[i]}
      ></bible-tools-single-verse>
    `

    await waitPromise(delay)
  }
}

export const BibleToolsSingleChapterRangeDelay = class extends LitElement {
  static get properties() {
    return {
      book: {
        type: String
      },
      chapter: {
        type: String
      },
      delay: {
        type: Number
      },
      endverse: {
        type: String
      },
      hasReference: {
        type: Boolean
      },
      hasVerses: {
        type: Boolean
      },
      isBlock: {
        type: Boolean
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
    this.delay = 0

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
      <span>${asyncAppend(
          bibleToolsSingleVerseDelay({
            book: this.book,
            chapter: this.chapter,
            delay: this.delay,
            hasVerse: this.hasVerses,
            isBlock: this.isBlock,
            verserange: this.verserange
          })
        )
      }</span>
    `
  }
}

if (!customElements.get('bible-tools-single-chapter-range-delay')) {
  customElements.define('bible-tools-single-chapter-range-delay', BibleToolsSingleChapterRangeDelay)
}
