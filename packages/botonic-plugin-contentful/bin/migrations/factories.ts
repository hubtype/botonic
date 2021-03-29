import { ContentType, Field } from 'contentful-migration'

export function createFieldKeywords(
  contentType: ContentType,
  required: boolean
): Field {
  const keywords = contentType
    .createField('keywords')
    .name('Keywords')
    .type('Array')
    .items({
      type: 'Symbol',
      validations: [
        {
          // ; is not a keyword separation. If somebody copy/paste the keywords from our excel,
          // they may forget to change it into a comma
          prohibitRegexp: { pattern: '[;,]' },
          message:
            'Do not add punctuation to keywords. If editing in list mode, separate them with commas',
        },
      ],
    })
    .required(required)
    .localized(true)
  // I get error "The selected widget does not exist anymore." in dashboard
  //  contentType.changeFieldControl('keywords', 'builtin', 'tagEditor');
  return keywords
}

export function createFieldName(
  contentType: ContentType,
  required = true
): Field {
  const fieldName = 'name'
  const field = contentType
    .createField(fieldName)
    .name('Code') // TODO should we rename to ID? Be consistent with flowbuilder
    .type('Symbol')
    .required(required)
    .validations([{ unique: true }])
    .localized(false)
  contentType.displayField(fieldName).moveField(fieldName).toTheTop()
  return field
}

export function createFieldShortText(
  contentType: ContentType,
  required: boolean
): Field {
  return contentType
    .createField('shortText')
    .name('Short Text')
    .type('Symbol')
    .required(required)
    .localized(true)
}

export function createFieldButtons(
  contentType: ContentType,
  required = false
): Field {
  console.log('Setting buttons link content type for ' + contentType.id)
  return contentType
    .createField('buttons')
    .name('buttons')
    .type('Array')
    .items({
      type: 'Link',
      linkType: 'Entry',
      localized: true,
      validations: [{ linkContentType: ['button', 'text', 'url', 'carousel'] }],
    })
    .required(required)
}

export function createFieldFollowUp(contentType: ContentType): Field {
  console.log('Setting followUp link content type for ' + contentType.id)
  return contentType
    .createField('followup')
    .name('Optional Follow up')
    .type('Link')
    .linkType('Entry')
    .required(false)
    .validations([
      { linkContentType: ['text', 'carousel', 'image', 'document', 'startUp'] },
    ])
}
