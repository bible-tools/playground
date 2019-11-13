import { LitElement, css, html } from 'https://unpkg.com/lit-element@2.2.1/lit-element.js?module'
import { until } from 'https://unpkg.com/lit-html@1.1.2/directives/until.js?module'

import { filterReferenceRange } from './utils.js'
import { Loading } from './loading.js'

const RangeTemplate = ({ chapterNumber, endVerse, startVerse, title }) => html`
  <bible-tools-single-chapter-range
    hasReference
    hasVerses
    isBlock
    book=${title}
    chapter=${chapterNumber}
    startverse=${startVerse}
    endverse=${endVerse}
  >
  </bible-tools-single-chapter-range>
`

const Template = ({ startBook, startChapter, endBook, endChapter, startVerse, endVerse, booksReference }) => {
  let totalChapters = 0

  return html`${filterReferenceRange(startBook, startChapter, endBook, endChapter, booksReference).map(books => {
    return Object.entries(books).map(book => {
      const title = book[0]

      totalChapters = totalChapters + book[1].chapters.length

      return Object.entries(book[1].chapters).map(chapter => {
        const chapterNumber = Number(chapter[1][0])
        const chapterLength = Number(chapter[1][1].verses)

        if (startBook === endBook && startChapter === endChapter) {
          return html`
            <span>${title} ${chapterNumber}</span>
            ${RangeTemplate({ chapterNumber, endVerse, startVerse, title })}
          `
        }

        for (let i = 0; i < totalChapters; i++) {
          return RangeTemplate({
            chapterNumber,
            endVerse: ((chapterLength, chapterNumber, endBook, endChapter, startBook, title) => {
                if ((title === startBook || title === endBook) && Number(endChapter) === chapterNumber) {
                  return endVerse
                } else {
                  return chapterLength
                }
              })(chapterLength, chapterNumber, endBook, endChapter, startBook, title),
            startVerse: ((chapterNumber, startChapter, startVerse) => {
                if (startBook === title && Number(startChapter) === chapterNumber) {
                  return startVerse
                } else {
                  return '1'
                }
              })(chapterNumber, startChapter, startVerse),
            title
          })
        }
      })
    })
  })}`
}

export const BibleToolsBookRange = class extends LitElement {
  static get properties() {
    return {
      endbook: {
        type: String
      },
      endchapter: {
        type: String
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
      startbook: {
        type: String
      },
      startchapter: {
        type: String
      },
      startverse: {
        type: String
      },
    }
  }

  static get styles() {
    return css`
      :host {}
    `
  }

  constructor() {
    super()

    this.hasReference = false
    this.hasVerses = false
    this.isBlock = false

    this.endbook = ''
    this.endchapter = ''
    this.endverse = ''
    this.startbook = ''
    this.startchapter = ''
    this.startverse = ''

    this.host='https://bible-tools.github.io/data/translations'
    this.language="en"
    this.translation="KJV"
  }

  render() {
    const referenceUrl = this.host + '/' + this.language + '/' +
      this.translation + '/reference.json'

    return html`
      ${until(fetch(referenceUrl).then(res => {
        if (res.ok) {
          return res.json().then(json => Template({
            hasReference: this.hasReference,
            hasVerse: this.hasVerse,
            isBlock: this.isBlock,
            startBook: this.startbook,
            startChapter: this.startchapter,
            startVerse: this.startverse,
            endBook: this.endbook,
            endChapter: this.endchapter,
            endVerse: this.endverse,
            booksReference: json
          }))
        }
      }), Loading(this.isBlock))}
    `
  }
}

if (!customElements.get('bible-tools-book-range')) {
  customElements.define('bible-tools-book-range', BibleToolsBookRange)
}
