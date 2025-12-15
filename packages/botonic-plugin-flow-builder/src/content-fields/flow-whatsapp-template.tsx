import { isWhatsapp } from '@botonic/core'
import {
  ActionRequest,
  Text,
  WhatsappTemplate,
  WhatsappTemplateBody,
  WhatsappTemplateButton,
  WhatsAppTemplateButtonSubType,
  WhatsAppTemplateComponentType,
  WhatsappTemplateFooter,
  WhatsappTemplateHeader,
  WhatsAppTemplateParameterType,
} from '@botonic/react'
import { WhatsappTemplateButtons } from '@botonic/react/lib/cjs/components/whatsapp-template/types'
import React from 'react'

import { trackOneContent } from '../tracking'
import { ContentFieldsBase } from './content-fields-base'
import {
  HtWhatsAppTemplateButtonsComponent,
  HtWhatsappTemplateNode,
} from './hubtype-fields'

export class FlowWhatsappTemplate extends ContentFieldsBase {
  public templateName = ''
  public templateLanguage = ''
  public variableValues: Record<string, string> = {}
  public header?: WhatsappTemplateHeader
  public body?: WhatsappTemplateBody
  public footer?: WhatsappTemplateFooter
  public buttons?: WhatsappTemplateButtons

  static fromHubtypeCMS(
    component: HtWhatsappTemplateNode
  ): FlowWhatsappTemplate {
    const whatsappTemplate = new FlowWhatsappTemplate(component.id)
    whatsappTemplate.code = component.code
    whatsappTemplate.templateName = component.content.template.name
    whatsappTemplate.templateLanguage = component.content.template.language
    whatsappTemplate.variableValues = component.content.variable_values

    // TODO: For now we don't support variables in header
    // whatsappTemplate.header = this.getHeaderComponent(
    //   component.content.template
    // )
    whatsappTemplate.body = this.getBodyComponent(
      component.content.variable_values
    )
    // TODO: For now we don't support variables in footer
    // whatsappTemplate.footer = this.getFooterComponent(
    //   component.content.template
    // )
    whatsappTemplate.buttons = this.getButtons(component)

    whatsappTemplate.followUp = component.follow_up

    return whatsappTemplate
  }

  // private static getHeaderComponent(
  //   whatsappTemplate: HtWhatsAppTemplate
  // ): WhatsappTemplateHeader | undefined {
  //   const headerComponent = whatsappTemplate.components.find(
  //     component => component.type === WhatsAppTemplateComponentType.HEADER
  //   ) as HtWhatsAppTemplateHeaderComponent | undefined
  //   if (headerComponent) {
  //     return {
  //       type: WhatsAppTemplateComponentType.HEADER,
  //       parameters: [
  //         {
  //           type: WhatsAppTemplateParameterType.TEXT,
  //           parameter_name: headerComponent.parameter_name, // TODO: Store in HtWhatsappTemplateNode variables for header
  //           text: headerComponent.text, // TODO: Use here param for header
  //         },
  //       ],
  //     }
  //   }
  //   return undefined
  // }

  // TODO: To use named variables (contact_info_fields) we need to take it from request.session.user.contact_info, this only be able in toBotonic method
  private static getBodyComponent(
    variableValues: Record<string, string>
  ): WhatsappTemplateBody {
    return {
      type: WhatsAppTemplateComponentType.BODY,
      parameters: Object.entries(variableValues).map(([key, value]) => ({
        type: WhatsAppTemplateParameterType.TEXT,
        parameter_name: key,
        text: value,
      })),
    }
  }

  // private static getFooterComponent(
  //   whatsappTemplate: HtWhatsAppTemplate
  // ): WhatsappTemplateFooter | undefined {
  //   const footerComponent = whatsappTemplate.components.find(
  //     component => component.type === WhatsAppTemplateComponentType.FOOTER
  //   ) as HtWhatsAppTemplateFooterComponent | undefined

  //   if (footerComponent) {
  //     return {
  //       type: WhatsAppTemplateComponentType.FOOTER,
  //       parameters: [
  //         {
  //           type: WhatsAppTemplateParameterType.TEXT,
  //           parameter_name: footerComponent.parameter_name, // TODO: Store in HtWhatsappTemplateNode variables for footer
  //           text: footerComponent.text, // TODO: Use here param for footer
  //         },
  //       ],
  //     }
  //   }
  //   return undefined
  // }

  private static getButtons(
    component: HtWhatsappTemplateNode
  ): WhatsappTemplateButtons | undefined {
    const whatsappTemplate = component.content.template
    const htWhatsappTemplateButtonsComponent = whatsappTemplate.components.find(
      component => component.type === WhatsAppTemplateComponentType.BUTTONS
    ) as HtWhatsAppTemplateButtonsComponent | undefined
    const buttonNodes = component.content.buttons

    if (htWhatsappTemplateButtonsComponent) {
      const buttons = htWhatsappTemplateButtonsComponent.buttons
        .filter(
          button => button.type === WhatsAppTemplateButtonSubType.QUICK_REPLY
        )
        .map((_button, index) => {
          // TODO: Implement buttons with dynamic URLs??
          // if (button.type === WhatsAppTemplateButtonSubType.URL) {
          //   return {
          //     type: WhatsAppTemplateComponentType.BUTTON,
          //     sub_type: WhatsAppTemplateButtonSubType.URL,
          //     index: index,
          //     parameters: [
          //       {
          //         type: WhatsAppTemplateParameterType.TEXT,
          //         text: button.url || '', // URL dynamic param
          //       },
          //     ],
          //   }
          // }

          // if (button.type === WhatsAppTemplateButtonSubType.QUICK_REPLY) {
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
          // }

          // TODO: Implement buttons with PHONE_NUMBER??
        })
      return {
        type: WhatsAppTemplateComponentType.BUTTONS,
        // @ts-ignore
        buttons: buttons,
      }
    }
    return undefined
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async trackFlow(_request: ActionRequest): Promise<void> {
    // await trackOneContent(request, this)
  }

  toBotonic(id: string, request: ActionRequest): JSX.Element {
    if (isWhatsapp(request.session)) {
      return (
        <WhatsappTemplate
          key={id}
          name={this.templateName}
          language={this.templateLanguage}
          // header={this.header}
          body={this.body}
          // footer={this.footer}
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
