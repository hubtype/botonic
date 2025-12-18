import { isWhatsapp } from '@botonic/core'
import {
  ActionRequest,
  Text,
  WhatsappTemplate,
  WhatsappTemplateButton,
  WhatsAppTemplateButtonSubType,
  WhatsappTemplateComponentBody,
  WhatsappTemplateComponentButtons,
  WhatsappTemplateComponentHeader,
  WhatsAppTemplateComponentType,
  WhatsAppTemplateParameterType,
  WhatsappTemplateQuickReplyButton,
  WhatsappTemplateUrlButton,
  WhatsappTemplateVoiceCallButton,
} from '@botonic/react'
import React from 'react'

import { getFlowBuilderPlugin } from '../helpers'
import { trackOneContent } from '../tracking'
import { ContentFieldsBase } from './content-fields-base'
import {
  HtButton,
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
  public htWhatsappTemplate: HtWhatsAppTemplate
  public variableValues: Record<string, string> = {}
  public headerVariables?: HeaderVariables
  public buttons?: HtButton[]
  public urlVariableValues?: Record<string, string>

  static fromHubtypeCMS(
    component: HtWhatsappTemplateNode
  ): FlowWhatsappTemplate {
    const whatsappTemplate = new FlowWhatsappTemplate(component.id)
    whatsappTemplate.code = component.code
    whatsappTemplate.htWhatsappTemplate = component.content.template
    whatsappTemplate.headerVariables = component.content.header_variables
    whatsappTemplate.variableValues = component.content.variable_values
    whatsappTemplate.buttons = component.content.buttons
    whatsappTemplate.urlVariableValues = component.content.url_variable_values

    whatsappTemplate.followUp = component.follow_up

    return whatsappTemplate
  }

  private getHeaderComponent(
    whatsappTemplate: HtWhatsAppTemplate,
    headerVariables: HeaderVariables,
    locale: string,
    request: ActionRequest
  ): WhatsappTemplateComponentHeader | undefined {
    const headerComponent = whatsappTemplate.components.find(
      component => component.type === WhatsAppTemplateComponentType.HEADER
    ) as HtWhatsAppTemplateHeaderComponent | undefined

    if (
      headerComponent &&
      headerComponent.format === WhatsAppTemplateParameterType.TEXT
    ) {
      return this.createHeaderTextComponent(headerVariables, request)
    }

    if (
      headerComponent &&
      headerComponent.format === WhatsAppTemplateParameterType.IMAGE
    ) {
      return this.createHeaderImageComponent(headerVariables, locale)
    }

    return undefined
  }

  private createHeaderTextComponent(
    headerVariables: HeaderVariables,
    request: ActionRequest
  ): WhatsappTemplateComponentHeader {
    return {
      type: WhatsAppTemplateComponentType.HEADER,
      parameters: Object.values(headerVariables.text || {}).map(value => {
        const valueVariable = this.replaceVariables(value, request)
        return {
          type: WhatsAppTemplateParameterType.TEXT,
          text: valueVariable,
        }
      }),
    }
  }

  private createHeaderImageComponent(
    headerVariables: HeaderVariables,
    locale: string
  ): WhatsappTemplateComponentHeader {
    return {
      type: WhatsAppTemplateComponentType.HEADER,
      parameters: [
        {
          type: WhatsAppTemplateParameterType.IMAGE,
          image: {
            link:
              headerVariables.media?.find(m => m.locale === locale)?.file || '',
          },
        },
      ],
    }
  }

  // TODO: To use named variables (contact_info_fields) we need to take it from request.session.user.contact_info, this only be able in toBotonic method
  private getBodyComponent(
    variableValues: Record<string, string>,
    request: ActionRequest
  ): WhatsappTemplateComponentBody {
    return {
      type: WhatsAppTemplateComponentType.BODY,
      parameters: Object.entries(variableValues).map(([key, value]) => {
        const valueVariable = this.replaceVariables(value, request)
        return {
          type: WhatsAppTemplateParameterType.TEXT,
          parameter_name: key,
          text: valueVariable,
        }
      }),
    }
  }

  private getButtons(
    whatsappTemplate: HtWhatsAppTemplate,
    buttonNodes: HtButton[],
    urlVariableValues: Record<string, string>,
    request: ActionRequest
  ): WhatsappTemplateComponentButtons | undefined {
    const htWhatsappTemplateButtons = whatsappTemplate.components.find(
      component => component.type === WhatsAppTemplateComponentType.BUTTONS
    ) as HtWhatsAppTemplateButtonsComponent | undefined

    if (htWhatsappTemplateButtons) {
      const buttons = htWhatsappTemplateButtons.buttons
        .map((button, index) => {
          if (button.type === WhatsAppTemplateButtonSubType.URL) {
            const urlParam: string | undefined =
              urlVariableValues?.[String(index)]
            if (!urlParam) {
              return null
            }
            return this.createUrlButtonComponent(index, urlParam, request)
          }

          if (button.type === WhatsAppTemplateButtonSubType.QUICK_REPLY) {
            const payload = buttonNodes[index].target?.id || ''
            return this.createQuickReplyButtonComponent(index, payload)
          }

          return this.createVoiceCallButtonComponent(index)
        })
        .filter(button => button !== null)

      return {
        type: WhatsAppTemplateComponentType.BUTTONS,
        buttons: buttons as WhatsappTemplateButton[],
      }
    }

    return undefined
  }

  private createUrlButtonComponent(
    index: number,
    urlParam: string,
    request: ActionRequest
  ): WhatsappTemplateUrlButton {
    const variableUrlParam = this.replaceVariables(urlParam, request)
    return {
      type: WhatsAppTemplateComponentType.BUTTON,
      sub_type: WhatsAppTemplateButtonSubType.URL,
      index: index,
      parameters: urlParam
        ? [
            {
              type: WhatsAppTemplateParameterType.TEXT,
              text: variableUrlParam,
            },
          ]
        : [],
    }
  }

  private createQuickReplyButtonComponent(
    index: number,
    payload: string
  ): WhatsappTemplateQuickReplyButton {
    return {
      type: WhatsAppTemplateComponentType.BUTTON,
      sub_type: WhatsAppTemplateButtonSubType.QUICK_REPLY,
      index: index,
      parameters: [
        {
          type: WhatsAppTemplateParameterType.PAYLOAD,
          payload: payload,
        },
      ],
    }
  }

  private createVoiceCallButtonComponent(
    index: number
  ): WhatsappTemplateVoiceCallButton {
    return {
      type: WhatsAppTemplateComponentType.BUTTON,
      sub_type: WhatsAppTemplateButtonSubType.VOICE_CALL,
      index: index,
      parameters: [],
    }
  }

  async trackFlow(request: ActionRequest): Promise<void> {
    await trackOneContent(request, this)
  }

  toBotonic(id: string, request: ActionRequest): JSX.Element {
    const templateName = this.htWhatsappTemplate.name
    const templateLanguage = this.htWhatsappTemplate.language
    const body = this.getBodyComponent(this.variableValues, request)
    const pluginFlowBuilder = getFlowBuilderPlugin(request.plugins)
    const resolvedLocale = pluginFlowBuilder.cmsApi.getResolvedLocale()

    const header = this.getHeaderComponent(
      this.htWhatsappTemplate,
      this.headerVariables || ({} as HeaderVariables),
      resolvedLocale,
      request
    )
    const buttons = this.getButtons(
      this.htWhatsappTemplate,
      this.buttons || [],
      this.urlVariableValues || {},
      request
    )

    console.log('toBotonic templateName', templateName)
    console.log('toBotonic templateLanguage', templateLanguage)
    console.log('toBotonic resolvedLocale', resolvedLocale)
    console.log('toBotonic header', JSON.stringify(header, null, 2))
    console.log('toBotonic body', JSON.stringify(body, null, 2))
    console.log('toBotonic buttons', JSON.stringify(buttons, null, 2))

    if (isWhatsapp(request.session)) {
      return (
        <WhatsappTemplate
          key={id}
          name={templateName}
          language={templateLanguage}
          header={header}
          body={body}
          buttons={buttons}
        />
      )
    }

    return (
      <Text key={id}>
        {`WhatsApp Template: ${templateName} (${templateLanguage})`}
        {header && `${JSON.stringify(header, null, 2)}`}
        {body && `${JSON.stringify(body, null, 2)}`}
        {buttons && `${JSON.stringify(buttons, null, 2)}`}
      </Text>
    )
  }
}
