/**
 * From https://github.com/Tutanchamon/pl_stemmer/blob/master/pl_stemmer.py
 */
import { Stemmer } from '@nlpjs/core/src'

export class StemmerPl implements Stemmer {
  stem(tokens: string[]): string[] {
    return tokens.map((stem: string) => {
      stem = stem.toLowerCase()
      stem = this.removeNouns(stem)
      stem = this.removeDiminutive(stem)
      const adj = this.removeAdjectiveEnds(stem)
      if (adj != stem) {
        return adj
      }
      stem = this.removeVerbsEnds(stem)
      stem = this.removeAdverbsEnds(stem)
      stem = this.removePluralForms(stem)
      return this.removeGeneralEnds(stem)
    })
  }

  private removeGeneralEnds(word: string): string {
    if (word.length > 4 && ['ia', 'ie'].includes(word.substr(-2))) {
      return word.substr(0, word.length - 2)
    }
    if (
      word.length > 4 &&
      ['', 'ą', 'i', 'a', 'ę', 'y', 'e', 'ł'].includes(word.substr(-1))
    ) {
      return word.substr(0, word.length - 1)
    }
    return word
  }

  private removeDiminutive(word: string): string {
    if (word.length > 6) {
      if (
        ['eczek', 'iczek', 'iszek', 'aszek', 'uszek'].includes(word.substr(-5))
      ) {
        return word.substr(0, word.length - 5)
      }
      if (['enek', 'ejek', 'erek'].includes(word.substr(-4))) {
        return word.substr(0, word.length - 2)
      }
    }
    if (word.length > 4) {
      if (['ek', 'ak'].includes(word.substr(-2))) {
        return word.substr(0, word.length - 2)
      }
    }
    return word
  }

  private removeVerbsEnds(word: string): string {
    // https://github.com/Tutanchamon/pl_stemmer/issues/2
    if (word.length > 5 && word.endsWith('bym')) {
      return word.substr(0, word.length - 3)
    }
    if (
      word.length > 5 &&
      [
        // eslint-disable-next-line prettier/prettier
        'esz', 'asz', 'cie', 'eść', 'esc','aść', 'asc','łem', 'lem','amy', 'emy'
      ].includes(word.substr(-3))
    ) {
      return word.substr(0, word.length - 3)
    }
    if (
      word.length > 3 &&
      [
        'esz',
        'asz',
        'eść',
        'esc',
        'aść',
        'asc',
        'eć',
        'ec',
        'ać',
        'ac',
      ].includes(word.substr(-3))
    ) {
      return word.substr(0, word.length - 2)
    }
    // https://github.com/Tutanchamon/pl_stemmer/issues/3
    if (word.length > 3 && ['aj'].includes(word.substr(-2))) {
      return word.substr(0, word.length - 1)
    }
    if (
      word.length > 3 &&
      [
        // eslint-disable-next-line prettier/prettier
        'ać', 'ac', 'em', 'am', 'ał', 'al','ił', 'il', 'ić', 'ic','ąc','ac'
      ].includes(word.substr(-2))
    ) {
      return word.substr(0, word.length - 2)
    }
    return word
  }

  private removeNouns(word: string): string {
    if (
      word.length > 7 &&
      ['zacja', 'zacją', 'zacji'].includes(word.substr(-5))
    ) {
      return word.substr(0, word.length - 4)
    }
    if (
      word.length > 6 &&
      ['acja', 'acji', 'acją', 'tach', 'anie', 'enie', 'eni', 'ani'].includes(
        word.substr(-4)
      )
    ) {
      return word.substr(0, word.length - 4)
    }
    if (word.length > 6 && word.endsWith('tyka')) {
      return word.substr(0, word.length - 2)
    }
    if (
      word.length > 5 &&
      ['ach', 'ami', 'nia', 'ni', 'cia', 'ci'].includes(word.substr(-3))
    ) {
      return word.substr(0, word.length - 3)
    }
    if (word.length > 5 && ['cji', 'cja', 'cją'].includes(word.substr(-3))) {
      return word.substr(0, word.length - 2)
    }
    if (word.length > 5 && ['ce', 'ta'].includes(word.substr(-2))) {
      return word.substr(0, word.length - 2)
    }
    return word
  }

  private removeAdjectiveEnds(word: string): string {
    if (
      word.length > 7 &&
      word.startsWith('naj') &&
      (word.endsWith('sze') || word.endsWith('szy'))
    ) {
      return word.substring(3, word.length - 3)
    }
    if (word.length > 7 && word.startsWith('naj') && word.endsWith('szych')) {
      return word.substring(3, word.length - 5)
    }
    if (word.length > 6 && word.endsWith('czny')) {
      return word.substr(0, word.length - 4)
    }
    if (
      word.length > 5 &&
      ['owy', 'owa', 'owe', 'ych', 'ego'].includes(word.substr(-3))
    ) {
      return word.substr(0, word.length - 3)
    }
    if (word.length > 5 && ['ej'].includes(word.substr(-2))) {
      return word.substr(0, word.length - 2)
    }
    return word
  }

  private removeAdverbsEnds(word: string): string {
    if (word.length > 4 && ['nie', 'wie'].includes(word.substr(-3))) {
      return word.substr(0, word.length - 2)
    }
    if (word.length > 4 && word.endsWith('rze')) {
      return word.substr(0, word.length - 2)
    }
    return word
  }

  private removePluralForms(word: string): string {
    if (
      word.length > 4 &&
      (word.endsWith('ów') || word.endsWith('ow') || word.endsWith('om'))
    ) {
      return word.substr(0, word.length - 2)
    }
    if (word.length > 4 && word.endsWith('ami')) {
      return word.substr(0, word.length - 3)
    }
    return word
  }
}
