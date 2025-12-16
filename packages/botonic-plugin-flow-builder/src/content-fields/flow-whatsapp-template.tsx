import { isWhatsapp } from '@botonic/core'
import {
  ActionRequest,
  Text,
  WhatsappTemplate,
  WhatsAppTemplateButtonSubType,
  WhatsappTemplateComponentBody,
  WhatsappTemplateComponentButtons,
  WhatsappTemplateComponentFooter,
  WhatsappTemplateComponentHeader,
  WhatsAppTemplateComponentType,
  WhatsAppTemplateParameterType,
  WhatsappTemplateQuickReplyButton,
} from '@botonic/react'
import React from 'react'

import { trackOneContent } from '../tracking'
import { ContentFieldsBase } from './content-fields-base'
import {
  HtMediaFileLocale,
  HtWhatsAppTemplate,
  HtWhatsAppTemplateButtonsComponent,
  HtWhatsAppTemplateHeaderComponent,
  HtWhatsappTemplateNode,
} from './hubtype-fields'

interface HeaderVariables {
  type: WhatsAppTemplateParameterType
  text?: Record<string, string>
  media?: HtMediaFileLocale[]
}

export class FlowWhatsappTemplate extends ContentFieldsBase {
  public templateName = ''
  public templateLanguage = ''
  public variableValues: Record<string, string> = {}
  public header?: WhatsappTemplateComponentHeader
  public body?: WhatsappTemplateComponentBody
  public footer?: WhatsappTemplateComponentFooter
  public buttons?: WhatsappTemplateComponentButtons
  public headerVariables?: HeaderVariables

  static fromHubtypeCMS(
    component: HtWhatsappTemplateNode
  ): FlowWhatsappTemplate {
    const whatsappTemplate = new FlowWhatsappTemplate(component.id)
    whatsappTemplate.code = component.code
    whatsappTemplate.templateName = component.content.template.name
    whatsappTemplate.templateLanguage = component.content.template.language

    whatsappTemplate.headerVariables = component.content.header_variables
    whatsappTemplate.header = this.getHeaderComponent(
      component.content.template,
      component.content.header_variables || ({} as HeaderVariables),
      'en'
    )

    whatsappTemplate.variableValues = component.content.variable_values
    whatsappTemplate.body = this.getBodyComponent(
      component.content.variable_values
    )

    whatsappTemplate.buttons = this.getButtons(component)

    whatsappTemplate.followUp = component.follow_up

    return whatsappTemplate
  }

  private static getHeaderComponent(
    whatsappTemplate: HtWhatsAppTemplate,
    headerVariables: HeaderVariables,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _locale: string
  ): WhatsappTemplateComponentHeader | undefined {
    const headerComponent = whatsappTemplate.components.find(
      component => component.type === WhatsAppTemplateComponentType.HEADER
    ) as HtWhatsAppTemplateHeaderComponent | undefined

    if (
      headerComponent &&
      headerComponent.format === WhatsAppTemplateParameterType.TEXT
    ) {
      return {
        type: WhatsAppTemplateComponentType.HEADER,
        parameters: Object.values(headerVariables.text || {}).map(value => ({
          type: WhatsAppTemplateParameterType.TEXT,
          text: value,
        })),
      }
    }

    if (
      headerComponent &&
      headerComponent.format === WhatsAppTemplateParameterType.IMAGE
    ) {
      return {
        type: WhatsAppTemplateComponentType.HEADER,
        parameters: [
          {
            type: WhatsAppTemplateParameterType.IMAGE,
            image: {
              link:
                headerVariables.media?.find(m => m.locale === _locale)?.file ||
                '',
            },
          },
        ],
      }
    }
    return undefined
  }

  // TODO: To use named variables (contact_info_fields) we need to take it from request.session.user.contact_info, this only be able in toBotonic method
  private static getBodyComponent(
    variableValues: Record<string, string>
  ): WhatsappTemplateComponentBody {
    return {
      type: WhatsAppTemplateComponentType.BODY,
      parameters: Object.entries(variableValues).map(([key, value]) => {
        return {
          type: WhatsAppTemplateParameterType.TEXT,
          parameter_name: key,
          text: value,
        }
      }),
    }
  }

  private static getButtons(
    component: HtWhatsappTemplateNode
  ): WhatsappTemplateComponentButtons | undefined {
    const whatsappTemplate = component.content.template
    const htWhatsappTemplateButtonsComponent = whatsappTemplate.components.find(
      component => component.type === WhatsAppTemplateComponentType.BUTTONS
    ) as HtWhatsAppTemplateButtonsComponent | undefined
    const buttonNodes = component.content.buttons

    if (htWhatsappTemplateButtonsComponent) {
      const buttons = htWhatsappTemplateButtonsComponent.buttons.map(
        (button, index) => {
          if (button.type === WhatsAppTemplateButtonSubType.URL) {
            const urlParam =
              component.content.url_variable_values?.[String(index)]
            return {
              type: WhatsAppTemplateComponentType.BUTTON,
              sub_type: WhatsAppTemplateButtonSubType.URL,
              index: index,
              parameters: urlParam
                ? [
                    {
                      type: WhatsAppTemplateParameterType.TEXT,
                      text: urlParam,
                    },
                  ]
                : [],
            }
          }

          if (button.type === WhatsAppTemplateButtonSubType.QUICK_REPLY) {
            return {
              type: WhatsAppTemplateComponentType.BUTTON,
              sub_type: WhatsAppTemplateButtonSubType.QUICK_REPLY,
              index: index,
              parameters: [
                {
                  type: WhatsAppTemplateParameterType.PAYLOAD,
                  payload: buttonNodes[index].target?.id || '',
                },
              ],
            }
          }
          return {
            type: WhatsAppTemplateComponentType.BUTTON,
            sub_type: WhatsAppTemplateButtonSubType.VOICE_CALL,
            index: index,
            parameters: [],
          }
        }
      )
      return {
        type: WhatsAppTemplateComponentType.BUTTONS,
        buttons: buttons as WhatsappTemplateQuickReplyButton[],
      }
    }
    return undefined
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async trackFlow(_request: ActionRequest): Promise<void> {
    // await trackOneContent(request, this)
  }

  toBotonic(id: string, request: ActionRequest): JSX.Element {
    console.log('toBotonic header', this.header?.parameters)
    console.log('toBotonic buttons', this.buttons?.buttons)
    if (isWhatsapp(request.session)) {
      return (
        <WhatsappTemplate
          key={id}
          name={this.templateName}
          language={this.templateLanguage}
          header={this.header}
          body={this.body}
          buttons={this.buttons}
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
