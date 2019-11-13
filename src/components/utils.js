export const waitPromise = (ms) => new Promise((res) => setTimeout(res, ms))

export const filterReferenceBooks = (startBook, endBook, referenceBooks) => {
  let flag = false

  return Object.entries(referenceBooks).filter(book => {
    if (book[0] === startBook) {
      flag = true

      return true
    }

    if (startBook === endBook) {
      return false
    }

    if (book[0] === endBook) {
      flag = false

      return true
    }

    return flag === true
  })
}

export const filterReferenceChapters = (startChapter, endChapter, referenceChapters) => {
  let flag = false

  return Object.entries(referenceChapters).filter(chapter => {
    if (chapter[0] === startChapter) {
      flag = true

      return true
    }

    if (startChapter === endChapter) {
      return false
    }

    if (chapter[0] === endChapter) {
      flag = false

      return true
    }

    return flag === true
  })
}

export const filterReferenceRange = (
  startBook,
  startChapter,
  endBook,
  endChapter,
  reference
) => {
  return filterReferenceBooks(startBook, endBook, reference.books).map((book) => {
    const title = book[0]

    return { [title]: { chapters: ((chapters) => {
      if (startBook === endBook) {
        return filterReferenceChapters(startChapter, endChapter, chapters)
      }

      if (title === startBook) {
        return filterReferenceChapters(startChapter, undefined, chapters)
      }

      if (title !== startBook && title !== endBook) {
        return filterReferenceChapters('1', undefined, chapters)
      }

      if (title === endBook) {
        return filterReferenceChapters('1', endChapter, chapters)
      }
    })(book[1].chapters) } }
  })
}
