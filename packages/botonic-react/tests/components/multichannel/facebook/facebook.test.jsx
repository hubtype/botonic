import { MultichannelFacebook } from '../../../../src/components/multichannel/facebook/facebook'

describe('Multichannel Facebook text converter', () => {
  const multichannelFacebook = new MultichannelFacebook()
  const button = {
    key: '1',
    props: {
      children: 'Children',
      url: 'https://botonic.io/',
    },
    type: 'Button',
  }

  const shortText =
    'Continetur devenietur id ex denegassem ponderibus imaginatio patrocinio.'

  const longText =
    'Continetur devenietur id ex denegassem ponderibus imaginatio patrocinio. Falso et se re entis quasi im. Ipsum ne opera at potui ipsis mo. Hic advertisse manifestum uti blandisque objectivae imaginaria assignetur. Re dare dari data ad ex isti ad meas quin. Aeque neque at multo coeco ac. Ullius habens longum necdum negans si ut.\nIm quia odor scio ea. Habet hic duo operi cum fas ullis. Dicunt at attigi re mentem eo longum ne creari videor. Credendam incurrant simplicia tantumque desumptam to de. Rationes ad re quanquam sensisse ac frigoris. Summam eo gustum seriem in vi. Credimus sorbonae ad ac in de cogitare.\nRem summum ope eae notatu sicuti calida causas. Machinam assidere circulum in facultas ab. Haberem volebam tur verarum mallent etc una seu referam ignotae. Heri sic rum ante sine quas fas modi. Nos creasse pendere crescit angelos etc. Is ii veat se suae admi nisi data meas an. Ei probent enatare et naturam. Igni bere meum at vi meae ob ente foco. Progressum expectanti deo advertebam confirmari objectivam age tractandae vix dem. Assentiar im singulari examinare voluntate inhaereat de si colligere me.\nAusi ente me idem utor adeo ob ille. Hominem inferri hos effugio una vel istarum. Gnum ii iste amen ab visu atra. Deo sic olim sese amen. Im co vereor opinio certas. Et legendo caetera disputo saporis exhibet ei. Propositio via explicetur ibi est designabam necessario quo.'

  const firstTexts = [
    'Continetur devenietur id ex denegassem ponderibus imaginatio patrocinio. Falso et se re entis quasi im. Ipsum ne opera at potui ipsis mo. Hic advertisse manifestum uti blandisque objectivae imaginaria assignetur. Re dare dari data ad ex isti ad meas quin. Aeque neque at multo coeco ac. Ullius habens longum necdum negans si ut.\nIm quia odor scio ea. Habet hic duo operi cum fas ullis. Dicunt at attigi re mentem eo longum ne creari videor. Credendam incurrant simplicia tantumque desumptam to de. Rationes ad re quanquam sensisse ac frigoris. Summam eo gustum seriem in vi. Credimus sorbonae ad ac in de cogitare.',
    'Rem summum ope eae notatu sicuti calida causas. Machinam assidere circulum in facultas ab. Haberem volebam tur verarum mallent etc una seu referam ignotae. Heri sic rum ante sine quas fas modi. Nos creasse pendere crescit angelos etc. Is ii veat se suae admi nisi data meas an. Ei probent enatare et naturam. Igni bere meum at vi meae ob ente foco. Progressum expectanti deo advertebam confirmari objectivam age tractandae vix dem. Assentiar im singulari examinare voluntate inhaereat de si colligere me.',
  ]

  const lastText =
    'Ausi ente me idem utor adeo ob ille. Hominem inferri hos effugio una vel istarum. Gnum ii iste amen ab visu atra. Deo sic olim sese amen. Im co vereor opinio certas. Et legendo caetera disputo saporis exhibet ei. Propositio via explicetur ibi est designabam necessario quo.'

  const expectedPropsWithoutChildren = {
    delay: '1',
  }

  test('TEST: Splits long text', () => {
    const props = {
      children: longText,
      delay: '1',
    }
    const {
      texts,
      propsLastText,
      propsWithoutChildren,
    } = multichannelFacebook.convertText(props, longText)

    const expectedPropsLastText = {
      children: [lastText],
      delay: '1',
    }

    expect(texts).toEqual(firstTexts)
    expect(propsLastText).toEqual(expectedPropsLastText)
    expect(propsWithoutChildren).toEqual(expectedPropsWithoutChildren)
  })

  test('TEST: Splits long text with buttons', () => {
    const props = {
      children: [longText, button],
      delay: '1',
    }
    const {
      texts,
      propsLastText,
      propsWithoutChildren,
    } = multichannelFacebook.convertText(props, longText)

    const expectedPropsLastText = {
      children: [lastText, button],
      delay: '1',
    }

    expect(texts).toEqual(firstTexts)
    expect(propsLastText).toEqual(expectedPropsLastText)
    expect(propsWithoutChildren).toEqual(expectedPropsWithoutChildren)
  })

  test('TEST: Does not split short text', () => {
    const props = {
      children: shortText,
      delay: '1',
    }
    const {
      texts,
      propsLastText,
      propsWithoutChildren,
    } = multichannelFacebook.convertText(props, shortText)
    expect(texts).toEqual(undefined)
    expect(propsLastText).toEqual(props)
    expect(propsWithoutChildren).toEqual(undefined)
  })

  test('TEST: Does not split short text with buttons', () => {
    const props = {
      children: [shortText, button],
      delay: '1',
    }
    const {
      texts,
      propsLastText,
      propsWithoutChildren,
    } = multichannelFacebook.convertText(props, shortText)
    expect(texts).toEqual(undefined)
    expect(propsLastText).toEqual(props)
    expect(propsWithoutChildren).toEqual(undefined)
  })
})
