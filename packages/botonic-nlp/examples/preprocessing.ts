import TokenizerEn from '../src/preprocess/engines/en/tokenizer-en'

const tokenizer = new TokenizerEn()
console.log(tokenizer.tokenize("I don't know how to do it!"))
