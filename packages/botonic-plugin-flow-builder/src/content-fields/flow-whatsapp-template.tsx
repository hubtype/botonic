import { type BotContext, isWhatsapp } from '@botonic/core'
import {
  Text,
  WhatsAppTemplateButtonSubType,
  WhatsAppTemplateComponentType,
  WhatsAppTemplateParameterType,
  WhatsappTemplate,
  type WhatsappTemplateButton,
  type WhatsappTemplateComponentBody,
  type WhatsappTemplateComponentButtons,
  type WhatsappTemplateComponentHeader,
  type WhatsappTemplateFlowAction,
  type WhatsappTemplateFlowButton,
  type WhatsappTemplatePhoneNumberButton,
  type WhatsappTemplateQuickReplyButton,
  type WhatsappTemplateUrlButton,
  type WhatsappTemplateVoiceCallButton,
} from '@botonic/react'

import { trackOneContent } from '../tracking'
import { getFlowBuilderPlugin } from '../utils/get-flow-builder-plugin'
import { ContentFieldsBase } from './content-fields-base'
import {
  type HtButton,
  type HtFlowButtonActionValue,
  type HtMediaFileLocale,
  type HtWhatsAppTemplate,
  type HtWhatsAppTemplateButtonsComponent,
  HtWhatsAppTemplateFlowActionType,
  type HtWhatsAppTemplateHeaderComponent,
  type HtWhatsappTemplateContentByLocale,
  type HtWhatsappTemplateNode,
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
  public flowButtonActionValues?: Record<string, HtFlowButtonActionValue>

  static fromHubtypeCMS(
    component: HtWhatsappTemplateNode,
    currentLocale: string
  ): FlowWhatsappTemplate {
    const whatsappTemplate = new FlowWhatsappTemplate(component.id)
    whatsappTemplate.code = component.code
    whatsappTemplate.buttons = component.content.buttons
    const contentByLocale = FlowWhatsappTemplate.getContentByLocale(
      component,
      currentLocale
    )

    if (!contentByLocale.template) {
      throw new Error(
        `Whatsapp template not configured for locale: ${currentLocale}`
      )
    }

    whatsappTemplate.htWhatsappTemplate = contentByLocale.template
    whatsappTemplate.headerVariables = contentByLocale.header_variables
    whatsappTemplate.variableValues = contentByLocale.variable_values || {}
    whatsappTemplate.urlVariableValues = contentByLocale.url_variable_values
    whatsappTemplate.flowButtonActionValues =
      contentByLocale.flow_button_action_values

    whatsappTemplate.followUp = component.follow_up

    return whatsappTemplate
  }

  private static getContentByLocale(
    component: HtWhatsappTemplateNode,
    currentLocale: string
  ) {
    const content: HtWhatsappTemplateContentByLocale | undefined =
      component.content.by_locale[currentLocale]
    if (!content) {
      throw new Error(
        `Whatsapp template content not found for locale: ${currentLocale}`
      )
    }
    return content
  }

  private getHeaderComponent(
    whatsappTemplate: HtWhatsAppTemplate,
    headerVariables: HeaderVariables,
    locale: string,
    botContext: BotContext
  ): WhatsappTemplateComponentHeader | undefined {
    const headerComponent = whatsappTemplate.components.find(
      component => component.type === WhatsAppTemplateComponentType.HEADER
    ) as HtWhatsAppTemplateHeaderComponent | undefined

    if (
      headerComponent &&
      headerComponent.format === WhatsAppTemplateParameterType.TEXT
    ) {
      return this.createHeaderTextComponent(headerVariables, botContext)
    }

    if (
      headerComponent &&
      headerComponent.format === WhatsAppTemplateParameterType.IMAGE
    ) {
      return this.createHeaderImageComponent(headerVariables, locale)
    }

    if (
      headerComponent &&
      headerComponent.format === WhatsAppTemplateParameterType.VIDEO
    ) {
      return this.createHeaderVideoComponent(headerVariables, locale)
    }

    return undefined
  }

  private createHeaderTextComponent(
    headerVariables: HeaderVariables,
    botContext: BotContext
  ): WhatsappTemplateComponentHeader {
    return {
      type: WhatsAppTemplateComponentType.HEADER,
      parameters: Object.values(headerVariables.text || {}).map(value => {
        const valueVariable = this.replaceVariables(value, botContext)
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

  private createHeaderVideoComponent(
    headerVariables: HeaderVariables,
    locale: string
  ): WhatsappTemplateComponentHeader {
    return {
      type: WhatsAppTemplateComponentType.HEADER,
      parameters: [
        {
          type: WhatsAppTemplateParameterType.VIDEO,
          video: {
            link:
              headerVariables.media?.find(m => m.locale === locale)?.file || '',
          },
        },
      ],
    }
  }

  // TODO: To use named variables (contact_info_fields) we need to take it from botContext.session.user.contact_info, this only be able in toBotonic method
  private getBodyComponent(
    variableValues: Record<string, string>,
    botContext: BotContext
  ): WhatsappTemplateComponentBody {
    return {
      type: WhatsAppTemplateComponentType.BODY,
      parameters: Object.entries(variableValues).map(([key, value]) => {
        const valueVariable = this.replaceVariables(value, botContext)
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
    flowButtonActionValues: Record<string, HtFlowButtonActionValue>,
    botContext: BotContext
  ): WhatsappTemplateComponentButtons | undefined {
    const htWhatsappTemplateButtons = whatsappTemplate.components.find(
      component => component.type === WhatsAppTemplateComponentType.BUTTONS
    ) as HtWhatsAppTemplateButtonsComponent | undefined

    if (!htWhatsappTemplateButtons) {
      return undefined
    }

    const buttons = htWhatsappTemplateButtons.buttons
      .map((button, index) =>
        this.mapTemplateButton(
          button,
          index,
          whatsappTemplate.name,
          buttonNodes,
          urlVariableValues,
          flowButtonActionValues,
          botContext
        )
      )
      .filter(button => button !== null)

    return {
      type: WhatsAppTemplateComponentType.BUTTONS,
      buttons: buttons as WhatsappTemplateButton[],
    }
  }

  private mapTemplateButton(
    button: HtWhatsAppTemplateButtonsComponent['buttons'][number],
    index: number,
    templateName: string,
    buttonNodes: HtButton[],
    urlVariableValues: Record<string, string>,
    flowButtonActionValues: Record<string, HtFlowButtonActionValue>,
    botContext: BotContext
  ): WhatsappTemplateButton | null {
    if (button.type === WhatsAppTemplateButtonSubType.URL) {
      const urlParam: string | undefined = urlVariableValues?.[String(index)]
      if (!urlParam) {
        return null
      }
      return this.createUrlButtonComponent(index, urlParam, botContext)
    }

    if (button.type === WhatsAppTemplateButtonSubType.QUICK_REPLY) {
      const payload = buttonNodes[index].target?.id || ''
      return this.createQuickReplyButtonComponent(index, payload)
    }

    if (button.type === WhatsAppTemplateButtonSubType.PHONE_NUMBER) {
      return this.createPhoneNumberButtonComponent(index)
    }

    if (button.type === WhatsAppTemplateButtonSubType.VOICE_CALL) {
      return this.createVoiceCallButtonComponent(index)
    }

    if (button.type === WhatsAppTemplateButtonSubType.FLOW) {
      const actionValue = flowButtonActionValues?.[String(index)]
      if (!actionValue) {
        throw new Error(
          `WhatsApp template '${templateName}' FLOW button at index ${index} requires flow_button_action_values`
        )
      }
      return this.createFlowButtonComponent(
        index,
        button,
        actionValue,
        botContext,
        templateName
      )
    }

    throw new Error(
      `WhatsApp template '${templateName}' has unsupported button at index ${index}`
    )
  }

  private createUrlButtonComponent(
    index: number,
    urlParam: string,
    botContext: BotContext
  ): WhatsappTemplateUrlButton {
    const variableUrlParam = this.replaceVariables(urlParam, botContext)
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

  private createPhoneNumberButtonComponent(
    index: number
  ): WhatsappTemplatePhoneNumberButton {
    return {
      type: WhatsAppTemplateComponentType.BUTTON,
      sub_type: WhatsAppTemplateButtonSubType.PHONE_NUMBER,
      index: index,
      parameters: [],
    }
  }

  private resolveFlowActionData(
    flowActionData: Record<string, string> | undefined,
    botContext: BotContext
  ): Record<string, string> | undefined {
    if (!flowActionData) {
      return undefined
    }

    const resolvedData = Object.fromEntries(
      Object.entries(flowActionData).map(([key, value]) => [
        key,
        this.replaceVariables(value, botContext),
      ])
    )

    return Object.keys(resolvedData).length > 0 ? resolvedData : undefined
  }

  private createFlowButtonComponent(
    index: number,
    templateButton: Extract<
      HtWhatsAppTemplateButtonsComponent['buttons'][number],
      { type: WhatsAppTemplateButtonSubType.FLOW }
    >,
    actionValue: HtFlowButtonActionValue,
    botContext: BotContext,
    templateName: string
  ): WhatsappTemplateFlowButton {
    const flowToken = this.replaceVariables(actionValue.flow_token, botContext)
    if (!flowToken.trim()) {
      throw new Error(
        `WhatsApp template '${templateName}' FLOW button at index ${index} requires a non-empty flow_token`
      )
    }

    const action: WhatsappTemplateFlowAction = {
      flow_token: flowToken,
    }

    if (
      templateButton.flow_action !==
      HtWhatsAppTemplateFlowActionType.DATA_EXCHANGE
    ) {
      const flowActionData = this.resolveFlowActionData(
        actionValue.flow_action_data,
        botContext
      )
      if (flowActionData) {
        action.flow_action_data = flowActionData
      }
    }

    return {
      type: WhatsAppTemplateComponentType.BUTTON,
      sub_type: WhatsAppTemplateButtonSubType.FLOW,
      index: String(index),
      parameters: [
        {
          type: WhatsAppTemplateParameterType.ACTION,
          action,
        },
      ],
    }
  }

  async trackFlow(botContext: BotContext): Promise<void> {
    await trackOneContent(botContext, this)
  }

  async processContent(botContext: BotContext): Promise<void> {
    await this.filterContent(botContext, this)
    await this.trackFlow(botContext)
    return
  }

  toBotonic(botContext: BotContext): JSX.Element {
    const templateName = this.htWhatsappTemplate.name
    const templateLanguage = this.htWhatsappTemplate.language
    const body = this.getBodyComponent(this.variableValues, botContext)
    const pluginFlowBuilder = getFlowBuilderPlugin(botContext.plugins)
    const resolvedLocale = pluginFlowBuilder.cmsApi.getResolvedLocale()

    const header = this.getHeaderComponent(
      this.htWhatsappTemplate,
      this.headerVariables || ({} as HeaderVariables),
      resolvedLocale,
      botContext
    )
    const buttons = this.getButtons(
      this.htWhatsappTemplate,
      this.buttons || [],
      this.urlVariableValues || {},
      this.flowButtonActionValues || {},
      botContext
    )

    if (isWhatsapp(botContext.session)) {
      return (
        <WhatsappTemplate
          key={this.id}
          name={templateName}
          language={templateLanguage}
          header={header}
          body={body}
          buttons={buttons}
        />
      )
    }

    return (
      <Text key={this.id}>
        {`WhatsApp Template: ${templateName} (${templateLanguage})`}
        {header && `${JSON.stringify(header, null, 2)}`}
        {body && `${JSON.stringify(body, null, 2)}`}
        {buttons && `${JSON.stringify(buttons, null, 2)}`}
      </Text>
    )
  }
}
