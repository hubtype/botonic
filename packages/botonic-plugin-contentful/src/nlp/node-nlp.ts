//import NlpUtil from 'node-nlp/lib/nlp/nlp-util';
import stemmer from 'node-nlp/lib/nlp/stemmers/natural/porter-stemmer-es';

export function normalize(inputText: string, stopWords: string[] = defaultStopWords): string[] {
  //const stemmer = NlpUtil.getStemmer('es');
  // const stemmer = ;
  let tokens = stemmer.tokenizeAndStem(
    inputText,
    // keeping stops because it cannot be configured (node-nlp/lib/nlp/stopwords/stopwords_es.json) and:
    // the default list contains "donde", which carries meaning in a sentence
    true
  );
  return tokens.filter(t => !stopWords.includes(t));
}

// TODO should be filtered before stemmer, because stemmer removes some final letters
const defaultStopWords = [
    "a","un","el","ella","y","sobre","de","la","que","en",
    "los","del","se","las","por","un","para","con","no",
    "una","su","al","lo","como","más","per"/*pero*/,"sus","le",
    "ya","o","porque","muy","sin","sobre","también",
    "me","hasta","desde","nos","durante","uno",
    "ni","contra","ese","eso","mí","qué","otro","él","cual",
    "poco","mi","tú","te","ti"
];

// "cuando","quien","donde",,
//   "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "_",,"sí"
