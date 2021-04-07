import { Sample } from './types'

export class EntitiesParser {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  static ENTITY_DEFINITION_PATTERN = /\[(.*?)\]\((.*?)\)/gm

  static parse(samples: Sample[], entities: string[]): Sample[] {
    return samples.map(sample => EntitiesParser.parseSample(sample, entities))
  }

  private static parseSample(sample: Sample, entities: string[]): Sample {
    const text = sample.text
    let accumulation = 0
    let m
    while ((m = EntitiesParser.ENTITY_DEFINITION_PATTERN.exec(text))) {
      if (entities.includes(m[2])) {
        sample.text = sample.text
          .slice(0, m.index - accumulation)
          .concat(m[1], sample.text.slice(m.index + m[0].length - accumulation))
        sample.entities.push({
          text: m[1],
          label: m[2],
          start: m.index - accumulation,
          end: m.index + m[1].length - accumulation,
        })
        accumulation += m[0].length - m[1].length
      } else {
        throw new Error(`Undefined entity: ${m[2]}`)
      }
    }
    return sample
  }
}
