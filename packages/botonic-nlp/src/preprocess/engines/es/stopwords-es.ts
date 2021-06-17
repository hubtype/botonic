export const STOPWORDS_ES: string[] = Object.keys(
  new (require('@nlpjs/lang-es/src/stopwords-es'))().dictionary
)
