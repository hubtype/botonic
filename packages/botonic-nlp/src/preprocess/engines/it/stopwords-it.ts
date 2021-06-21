export const STOPWORDS_IT: string[] = Object.keys(
  new (require('@nlpjs/lang-it/src/stopwords-it'))().dictionary
)
