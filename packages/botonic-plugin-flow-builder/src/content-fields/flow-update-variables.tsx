import {
  type BotContext,
  EventAction,
  type EventUpdateVariables,
  type Session,
} from '@botonic/core'

import { ContactInfoFieldsClient } from '../services/contact-info-fields-api'
import {
  getCommonFlowContentEventArgsForContentId,
  trackEvent,
} from '../tracking'
import { ContentFieldsBase } from './content-fields-base'
import type { HtUpdateVariablesNode } from './hubtype-fields/update-variables'

const SESSION_CONTACT_INFO_PREFIX = 'session.user.contact_info.'

export class FlowUpdateVariables extends ContentFieldsBase {
  public setVariables: Record<string, string | number | boolean> = {}
  public unsetVariables: string[] = []

  static async fromHubtypeCMS(
    cmsUpdateVariables: HtUpdateVariablesNode,
    botContext: BotContext
  ): Promise<FlowUpdateVariables> {
    const newUpdateVariables = new FlowUpdateVariables(cmsUpdateVariables.id)
    newUpdateVariables.setVariables = cmsUpdateVariables.content.set_variables
    newUpdateVariables.unsetVariables =
      cmsUpdateVariables.content.unset_variables
    await newUpdateVariables.applyVariablesAndSyncContactInfo(botContext)
    return newUpdateVariables
  }

  private async applyVariablesAndSyncContactInfo(
    botContext: BotContext
  ): Promise<void> {
    const contactInfoUpdates: {
      fieldName: string
      value: string | number | boolean | undefined
    }[] = []

    const updateVariable = (
      keyPath: string,
      value: string | number | boolean | undefined
    ) => {
      const fieldName = this.getContactInfoFieldName(keyPath)

      if (fieldName) {
        this.updateSessionContactInfoField(botContext, fieldName, value)
        contactInfoUpdates.push({ fieldName, value })
      } else {
        this.setSessionValueFromKeyPath(botContext, keyPath, value)
      }
    }

    for (const [keyPath, value] of Object.entries(this.setVariables)) {
      updateVariable(keyPath, value)
    }

    for (const keyPath of this.unsetVariables) {
      updateVariable(keyPath, undefined)
    }

    if (contactInfoUpdates.length === 0) {
      return
    }

    const contactInfoFieldsClient = new ContactInfoFieldsClient(botContext)

    await Promise.all(
      contactInfoUpdates.map(({ fieldName, value }) => {
        if (value === undefined) {
          return contactInfoFieldsClient.delete(fieldName)
        }
        return contactInfoFieldsClient.update(fieldName, value)
      })
    )
  }

  private setSessionValueFromKeyPath(
    botContext: BotContext,
    keyPath: string,
    value: string | number | boolean | undefined
  ): void {
    const keys = keyPath.split('.')
    if (keys.shift() !== 'session') {
      return
    }

    const lastKey = keys.pop()
    if (!lastKey) {
      return
    }

    let current: Session = botContext.session
    for (const key of keys) {
      if (current[key] === undefined || current[key] === null) {
        current[key] = {}
      }
      current = current[key]
    }
    current[lastKey] = value
  }

  private getContactInfoFieldName(keyPath: string): string | undefined {
    if (!keyPath.startsWith(SESSION_CONTACT_INFO_PREFIX)) {
      return undefined
    }
    const fieldName = keyPath.slice(SESSION_CONTACT_INFO_PREFIX.length)
    return fieldName || undefined
  }

  private updateSessionContactInfoField(
    botContext: BotContext,
    fieldName: string,
    value: string | number | boolean | undefined
  ): void {
    if (!botContext.session.user.contact_info) {
      botContext.session.user.contact_info = []
    }

    const contactInfo = botContext.session.user.contact_info
    const index = contactInfo.findIndex(field => field.name === fieldName)

    if (value === undefined) {
      if (index >= 0) {
        contactInfo.splice(index, 1)
      }
      return
    }

    const stringValue = String(value)
    const valueType = typeof value

    if (index >= 0) {
      contactInfo[index].value = stringValue
      contactInfo[index].type = valueType
      return
    }

    contactInfo.push({
      name: fieldName,
      type: valueType,
      value: stringValue,
    })
  }

  async trackFlow(botContext: BotContext): Promise<void> {
    const { flowThreadId, flowId, flowName, flowNodeId, flowNodeContentId } =
      getCommonFlowContentEventArgsForContentId(botContext, this.id)
    const eventUpdateVariables: EventUpdateVariables = {
      action: EventAction.UpdateVariables,
      flowThreadId,
      flowId,
      flowName,
      flowNodeId,
      flowNodeContentId,
      flowNodeIsMeaningful: false,
      setVariables: this.setVariables,
      unsetVariables: this.unsetVariables,
    }
    const { action, ...eventArgs } = eventUpdateVariables
    await trackEvent(botContext, action, eventArgs)
  }

  producesBotResponse(): boolean {
    return false
  }

  async processContent(botContext: BotContext): Promise<void> {
    await this.trackFlow(botContext)
  }

  toBotonic() {
    return <></>
  }
}
