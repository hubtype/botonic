import { Stemmer } from '@nlpjs/core/src'

// from https://github.com/mrshu/stemm-sk/blob/master/stemmsk/__init__.py
export class StemmerSk implements Stemmer {
  constructor(public aggressive = false) {}

  stem(tokens: string[]): string[] {
    return tokens.map(token => this.stemToken(token))
  }

  private stemToken(token: string): string {
    let stem = this.removeCase(token)
    stem = this.removePossessives(stem)

    if (this.aggressive) {
      stem = this.removeComparative(stem)
      stem = this.removeDiminutive(stem)
      stem = this.removeAugmentative(stem)
      stem = this.removeDerivational(stem)
    }

    return stem
  }

  private removeCase(token: string): string {
    const length = token.length

    if (length > 7 && token.endsWith('atoch')) {
      return token.slice(0, length - 5)
    }

    if (length > 6) {
      if (token.endsWith('aťom')) {
        return this.palatalise(token.slice(0, length - 3))
      }
    }

    if (length > 5) {
      const tokenEnding = token.slice(-3)
      if (
        tokenEnding in
        [
          'och',
          'ich',
          'ích',
          'ého',
          'ami',
          'emi',
          'ému',
          'ete',
          'eti',
          'iho',
          'ího',
          'ími',
          'imu',
          'aťa',
        ]
      ) {
        return this.palatalise(token.slice(0, length - 2))
      }

      if (
        tokenEnding in ['ách', 'ata', 'aty', 'ých', 'ami', 'ové', 'ovi', 'ými']
      ) {
        return token.slice(0, length - 3)
      }
    }

    if (length > 4) {
      if (token.endsWith('om')) {
        return this.palatalise(token.slice(0, length - 1))
      }

      const tokenEnding = token.slice(-2)

      if (tokenEnding in ['es', 'ém', 'ím']) {
        return this.palatalise(token.slice(0, length - 2))
      }

      if (
        tokenEnding in ['úm', 'at', 'ám', 'os', 'us', 'ým', 'mi', 'ou', 'ej']
      ) {
        return token.slice(0, length - 2)
      }
    }

    if (length > 3) {
      const tokenLastCharacter = token.slice(-1)
      if (tokenLastCharacter in ['e', 'i', 'í']) {
        return this.palatalise(token)
      }
      if (tokenLastCharacter in ['ú', 'y', 'a', 'o', 'á', 'é', 'ý']) {
        return token.slice(0, length - 1)
      }
    }

    return token
  }

  private palatalise(token: string): string {
    const length = token.length

    let lastCharacters = token.slice(-2)
    let substring = token.slice(0, length - 2)

    if (lastCharacters in ['ci', 'ce', 'či', 'če']) {
      return substring + 'k'
    }

    if (lastCharacters in ['zi', 'ze', 'ži', 'že']) {
      return substring + 'h'
    }

    lastCharacters = token.slice(-3)
    substring = token.slice(0, length - 3)

    if (lastCharacters in ['čte', 'čti', 'čtí']) {
      return substring + 'ck'
    }

    if (lastCharacters in ['šte', 'šti', 'ští']) {
      return substring + 'sk'
    }

    return token.slice(0, length - 1)
  }

  private removePossessives(token: string): string {
    const length = token.length
    if (length > 5) {
      if (token.endsWith('ov')) {
        return token.slice(0, length - 2)
      }
      if (token.endsWith('in')) {
        return this.palatalise(token.slice(0, length - 1))
      }
    }
    return token
  }

  private removeComparative(token: string): string {
    const length = token.length
    if (length > 5) {
      const tokenEnding = token.slice(-3)
      if (tokenEnding in ['ejš', 'ějš']) {
        return this.palatalise(token.slice(0, length - 2))
      }
    }
    return token
  }

  private removeDiminutive(token: string): string {
    const length = token.length

    if (length > 7 && token.endsWith('oušok')) {
      return token.slice(0, length - 5)
    }

    if (length > 6) {
      const tokenEnding = token.slice(-4)

      if (
        tokenEnding in
        ['ečok', 'éčok', 'ičok', 'íčok', 'enok', 'énok', 'inok', 'ínok']
      ) {
        return this.palatalise(token.slice(0, length - 3))
      }

      if (
        tokenEnding in
        ['áčok', 'ačok', 'očok', 'učok', 'anok', 'onok', 'unok', 'ánok']
      ) {
        return this.palatalise(token.slice(0, length - 4))
      }
    }

    if (length > 5) {
      const tokenEnding = token.slice(-3)

      if (
        tokenEnding in ['ečk', 'éčk', 'ičk', 'íčk', 'enk', 'énk', 'ink', 'ínk']
      ) {
        return this.palatalise(token.slice(0, length - 3))
      }

      if (
        tokenEnding in
        ['áčk', 'ačk', 'očk', 'učk', 'ank', 'onk', 'unk', 'átk', 'ánk', 'ušk']
      ) {
        return token.slice(0, length - 3)
      }
    }

    if (length > 4) {
      const tokenEnding = token.slice(-2)

      if (tokenEnding in ['ek', 'ék', 'ík', 'ik']) {
        return this.palatalise(token.slice(0, length - 1))
      }

      if (tokenEnding in ['ák', 'ak', 'ok', 'uk']) {
        return token.slice(0, length - 1)
      }
    }

    if (length > 3 && token.slice(-1) == 'k') {
      return token.slice(0, length - 1)
    }

    return token
  }

  private removeAugmentative(token: string): string {
    const length = token.length

    if (length > 6 && token.endsWith('ajzn')) {
      return token.slice(0, length - 4)
    }

    if (length > 5 && token.slice(-3) in ['izn', 'isk']) {
      return this.palatalise(token.slice(0, length - 2))
    }

    if (length > 4 && token.endsWith('ák')) {
      return token.slice(0, length - 2)
    }

    return token
  }

  // eslint-disable-next-line complexity
  private removeDerivational(token: string): string {
    const length = token.length

    if (length > 8 && token.endsWith('obinec')) {
      return token.slice(0, length - 6)
    }

    if (length > 7) {
      if (token.endsWith('ionár')) {
        return this.palatalise(token.slice(0, length - 4))
      }

      if (token.slice(-5) in ['ovisk', 'ovstv', 'ovišt', 'ovník']) {
        return token.slice(0, length - 5)
      }
    }

    if (length > 6) {
      const tokenEnding = token.slice(-4)

      if (
        tokenEnding in
        ['ások', 'nosť', 'teln', 'ovec', 'ovík', 'ovtv', 'ovin', 'štin']
      ) {
        return token.slice(0, length - 4)
      }

      if (tokenEnding in ['enic', 'inec', 'itel']) {
        return this.palatalise(token.slice(0, length - 3))
      }
    }

    if (length > 5) {
      if (token.endsWith('árn')) {
        return token.slice(0, length - 3)
      }

      const tokenEnding = token.slice(-3)

      if (tokenEnding in ['enk', 'ián', 'ist', 'isk', 'išt', 'itb', 'írn']) {
        return this.palatalise(token.slice(0, length - 2))
      }

      if (
        tokenEnding in
        [
          'och',
          'ost',
          'ovn',
          'oun',
          'out',
          'ouš',
          'ušk',
          'kyn',
          'čan',
          'kář',
          'néř',
          'ník',
          'ctv',
          'stv',
        ]
      ) {
        return token.slice(0, length - 3)
      }
    }

    if (length > 4) {
      const tokenEnding = token.length

      if (tokenEnding in ['áč', 'ač', 'án', 'an', 'ár', 'ar', 'ás', 'as']) {
        return token.slice(0, length - 2)
      }

      if (
        tokenEnding in ['ec', 'en', 'ér', 'ír', 'ic', 'in', 'ín', 'it', 'iv']
      ) {
        return this.palatalise(token.slice(0, length - 1))
      }

      if (
        tokenEnding in
        [
          'ob',
          'ot',
          'ov',
          'oň',
          'ul',
          'yn',
          'čk',
          'čn',
          'dl',
          'nk',
          'tv',
          'tk',
          'vk',
        ]
      ) {
        return token.slice(0, length - 2)
      }
    }

    if (length > 3 && token.slice(-1) in ['c', 'č', 'k', 'l', 'n', 't']) {
      return token.slice(0, length - 1)
    }
    return token
  }
}
