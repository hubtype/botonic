import { isWhatsapp } from '@botonic/core'
import { ActionRequest, Text, WhatsappTemplate } from '@botonic/react'
import React from 'react'

import { trackOneContent } from '../tracking'
import { ContentFieldsBase } from './content-fields-base'
import { HtWhatsappTemplateNode } from './hubtype-fields'

export class FlowWhatsappTemplate extends ContentFieldsBase {
  public templateName = ''
  public templateLanguage = ''

  static fromHubtypeCMS(
    component: HtWhatsappTemplateNode
  ): FlowWhatsappTemplate {
    const whatsappTemplate = new FlowWhatsappTemplate(component.id)
    whatsappTemplate.code = component.code
    whatsappTemplate.templateName = component.content.template_name
    whatsappTemplate.templateLanguage = component.content.template_language
    // TODO: Keep adding header, body, footer, etc.
    whatsappTemplate.followUp = component.follow_up

    return whatsappTemplate
  }

  async trackFlow(request: ActionRequest): Promise<void> {
    await trackOneContent(request, this)
  }

  toBotonic(id: string, request: ActionRequest): JSX.Element {
    if (isWhatsapp(request.session)) {
      return (
        <WhatsappTemplate
          key={id}
          name={this.templateName}
          language={this.templateLanguage}
        />
      )
    }

    return (
      <Text key={id}>
        {`WhatsApp Template: ${this.templateName} (${this.templateLanguage})`}
      </Text>
    )
  }
}
