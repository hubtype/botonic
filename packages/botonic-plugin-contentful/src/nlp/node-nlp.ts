//import NlpUtil from 'node-nlp/lib/nlp/nlp-util';
import stemmer from 'node-nlp/lib/nlp/stemmers/natural/porter-stemmer-es';

export function normalize(inputText: string): string[] {
  //const stemmer = NlpUtil.getStemmer('es');
  // const stemmer = ;
  return stemmer.tokenizeAndStem(
    inputText,
    // keeping stops because it cannot be configured (node-nlp/lib/nlp/stopwords/stopwords_es.json) and:
    // the default list contains "donde", which carries meaning in a sentence
    true
  );
}
