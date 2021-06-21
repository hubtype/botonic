export const STOPWORDS_RU: string[] = Object.keys(
  new (require('@nlpjs/lang-ru/src/stopwords-ru'))().dictionary
)
