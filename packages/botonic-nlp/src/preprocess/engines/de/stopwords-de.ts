export const STOPWORDS_DE: string[] = Object.keys(
  new (require('@nlpjs/lang-de/src/stopwords-de'))().dictionary
)
