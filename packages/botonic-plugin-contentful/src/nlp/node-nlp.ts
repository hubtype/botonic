import stemmer from 'node-nlp/lib/nlp/stemmers/natural/porter-stemmer-es';

// TODO should be filtered before stemmer, because stemmer removes some final letters
const defaultStopWords = [
  // "cuando","quien","donde",,
  //   "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "_",,"sí"
  // eslint-disable-next-line prettier/prettier
  "a","un","el","ella","y","sobre","de","la","que","en",
  // eslint-disable-next-line prettier/prettier
  "los","del","se","las","por","un","para","con","no",
  // eslint-disable-next-line prettier/prettier
  "una","su","al","lo","como","más","per"/*pero*/,"sus","le",
  // eslint-disable-next-line prettier/prettier
  "ya","o","porque","muy","sin","sobre","también",
  // eslint-disable-next-line prettier/prettier
  "me","hasta","desde","nos","durante","uno",
  // eslint-disable-next-line prettier/prettier
  "ni","contra","ese","eso","mí","qué","otro","él","cual",
  // eslint-disable-next-line prettier/prettier
  "poco","mi","tú","te","ti"
];

export function tokenizeAndStem(
  inputText: string,
  stopWords?: string[]
): string[] {
  stopWords = stopWords || defaultStopWords;
  //const stemmer = NlpUtil.getStemmer('es');
  // const stemmer = ;
  let tokens: string[] = stemmer.tokenizeAndStem(
    inputText,
    // keeping stops because it cannot be configured (node-nlp/lib/nlp/stopwords/stopwords_es.json) and:
    // the default list contains "donde", which carries meaning in a sentence
    true
  );
  return tokens.filter(t => !stopWords!.includes(t));
}

