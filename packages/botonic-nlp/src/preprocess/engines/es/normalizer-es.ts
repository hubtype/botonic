import { Normalizer } from '../../types'

export default class NormalizerEs implements Normalizer {
  readonly locale = 'es'
  normalize(text: string): string {
    return this.removeDiacritics(text.trim().toLowerCase())
  }
  private removeDiacritics(text: string): string {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  }
}
