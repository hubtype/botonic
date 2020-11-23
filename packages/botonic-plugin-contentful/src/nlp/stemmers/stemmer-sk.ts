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
      if (token.endsWith('atom')) {
        return this.palatalise(token.slice(0, length - 3))
      }
    }

    if (length > 5) {
      const tokenEnding = token.slice(-3)
      if (
        [
          'ami',
          'ata',
          'eho',
          'emi',
          'emu',
          'ete',
          'eti',
          'ich',
          'ich',
          'iho',
          'iho',
          'imi',
          'imu',
          'och',
        ].includes(tokenEnding)
      ) {
        return this.palatalise(token.slice(0, length - 2))
      }

      if (
        ['ach', 'ami', 'ata', 'aty', 'ove', 'ovi', 'ych', 'ymi'].includes(
          tokenEnding
        )
      ) {
        return token.slice(0, length - 3)
      }
    }

    if (length > 4) {
      if (token.endsWith('om')) {
        return this.palatalise(token.slice(0, length - 1))
      }

      const tokenEnding = token.slice(-2)

      if (['em', 'es', 'im'].includes(tokenEnding)) {
        return this.palatalise(token.slice(0, length - 2))
      }

      if (
        ['am', 'at', 'ej', 'mi', 'os', 'ou', 'um', 'us', 'ym'].includes(
          tokenEnding
        )
      ) {
        return token.slice(0, length - 2)
      }
    }

    if (length > 3) {
      const tokenLastCharacter = token.slice(-1)
      if (['e', 'i'].includes(tokenLastCharacter)) {
        return this.palatalise(token)
      }
      if (['a', 'e', 'o', 'u', 'y'].includes(tokenLastCharacter)) {
        return token.slice(0, length - 1)
      }
    }

    return token
  }

  private palatalise(token: string): string {
    const length = token.length

    let lastCharacters = token.slice(-2)
    let substring = token.slice(0, length - 2)

    if (['ce', 'ci'].includes(lastCharacters)) {
      return substring + 'k'
    }

    if (['ze', 'zi'].includes(lastCharacters)) {
      return substring + 'h'
    }

    lastCharacters = token.slice(-3)
    substring = token.slice(0, length - 3)

    if (['cte', 'cti'].includes(lastCharacters)) {
      return substring + 'ck'
    }

    if (['ste', 'sti'].includes(lastCharacters)) {
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
      if (token.endsWith('ejs')) {
        return this.palatalise(token.slice(0, length - 2))
      }
    }
    return token
  }

  private removeDiminutive(token: string): string {
    const length = token.length

    if (length > 7 && token.endsWith('ousok')) {
      return token.slice(0, length - 5)
    }

    if (length > 6) {
      const tokenEnding = token.slice(-4)

      if (['ecok', 'enok', 'icok', 'inok'].includes(tokenEnding)) {
        return this.palatalise(token.slice(0, length - 3))
      }

      if (
        ['acok', 'anok', 'ocok', 'onok', 'ucok', 'unok'].includes(tokenEnding)
      ) {
        return this.palatalise(token.slice(0, length - 4))
      }
    }

    if (length > 5) {
      const tokenEnding = token.slice(-3)

      if (['eck', 'enk', 'ick', 'ink'].includes(tokenEnding)) {
        return this.palatalise(token.slice(0, length - 3))
      }

      if (
        ['ack', 'ank', 'atk', 'ock', 'onk', 'uck', 'unk', 'usk'].includes(
          tokenEnding
        )
      ) {
        return token.slice(0, length - 3)
      }
    }

    if (length > 4) {
      const tokenEnding = token.slice(-2)

      if (['ek', 'ik'].includes(tokenEnding)) {
        return this.palatalise(token.slice(0, length - 1))
      }

      if (['ak', 'ok', 'uk'].includes(tokenEnding)) {
        return token.slice(0, length - 1)
      }
    }

    if (length > 3 && token.endsWith('k')) {
      return token.slice(0, length - 1)
    }

    return token
  }

  private removeAugmentative(token: string): string {
    const length = token.length

    if (length > 6 && token.endsWith('ajzn')) {
      return token.slice(0, length - 4)
    }

    if (length > 5 && ['izn', 'isk'].includes(token.slice(-3))) {
      return this.palatalise(token.slice(0, length - 2))
    }

    if (length > 4 && token.endsWith('ak')) {
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
      if (token.endsWith('ionar')) {
        return this.palatalise(token.slice(0, length - 4))
      }

      if (['ovisk', 'ovist', 'ovnik', 'ovstv'].includes(token.slice(-5))) {
        return token.slice(0, length - 5)
      }
    }

    if (length > 6) {
      const tokenEnding = token.slice(-4)

      if (
        [
          'asok',
          'nost',
          'ovec',
          'ovik',
          'ovin',
          'ovtv',
          'stin',
          'teln',
        ].includes(tokenEnding)
      ) {
        return token.slice(0, length - 4)
      }

      if (['enic', 'inec', 'itel'].includes(tokenEnding)) {
        return this.palatalise(token.slice(0, length - 3))
      }
    }

    if (length > 5) {
      if (token.endsWith('arn')) {
        return token.slice(0, length - 3)
      }

      const tokenEnding = token.slice(-3)

      if (['enk', 'ian', 'irn', 'isk', 'ist', 'itb'].includes(tokenEnding)) {
        return this.palatalise(token.slice(0, length - 2))
      }

      if (
        [
          'can',
          'ctv',
          'kar',
          'kyn',
          'ner',
          'nik',
          'och',
          'ost',
          'oun',
          'ous',
          'out',
          'ovn',
          'stv',
          'usk',
        ].includes(tokenEnding)
      ) {
        return token.slice(0, length - 3)
      }
    }

    if (length > 4) {
      const tokenEnding = token.slice(-2)

      if (['ac', 'an', 'ar', 'as'].includes(tokenEnding)) {
        return token.slice(0, length - 2)
      }

      if (
        ['ec', 'en', 'er', 'ic', 'in', 'ir', 'it', 'iv'].includes(tokenEnding)
      ) {
        return this.palatalise(token.slice(0, length - 1))
      }

      if (
        [
          'ck',
          'cn',
          'dl',
          'nk',
          'ob',
          'on',
          'ot',
          'ov',
          'tk',
          'tv',
          'ul',
          'vk',
          'yn',
        ].includes(tokenEnding)
      ) {
        return token.slice(0, length - 2)
      }
    }

    if (length > 3 && ['c', 'k', 'l', 'n', 't'].includes(token.slice(-1))) {
      return token.slice(0, length - 1)
    }
    return token
  }
}
