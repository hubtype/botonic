export const STOPWORDS_FR: string[] = Object.keys(
  new (require('@nlpjs/lang-fr/src/stopwords-fr'))().dictionary
)
