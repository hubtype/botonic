export const STOPWORDS_EN: string[] = Object.keys(
  new (require('@nlpjs/lang-en-min/src/stopwords-en'))().dictionary
)
