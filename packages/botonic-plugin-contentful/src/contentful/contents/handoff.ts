import * as contentful from 'contentful'

import * as cms from '../../cms'
import {
  CmsException,
  ContentType,
  HandoffAgent,
  HandoffAgentEmail,
  HandoffAgentId,
  OnFinish,
  Queue,
} from '../../cms'
import { TopContentDelivery } from '../content-delivery'
import { DeliveryApi } from '../delivery-api'
import {
  addCustomFields,
  CommonEntryFields,
  ContentfulEntryUtils,
} from '../delivery-utils'
import { CallbackTarget, getTargetCallback } from './callback-delivery'
import { QueueDelivery, QueueFields } from './queue'

export class HandoffDelivery extends TopContentDelivery {
  static REFERENCES_INCLUDE = QueueDelivery.REFERENCES_INCLUDE + 1
  constructor(
    delivery: DeliveryApi,
    private readonly queueDelivery: QueueDelivery,
    resumeErrors: boolean
  ) {
    super(ContentType.HANDOFF, delivery, resumeErrors)
  }

  async handoff(id: string, context: cms.Context): Promise<cms.Handoff> {
    const entry: contentful.Entry<HandoffFields> = await this.getEntry(
      id,
      context,
      { include: HandoffDelivery.REFERENCES_INCLUDE }
    )
    return this.fromEntry(entry, context)
  }

  private onFinish(
    entry: contentful.Entry<HandoffFields>,
    context: cms.Context
  ): OnFinish {
    if (!entry.fields.onFinish) {
      throw new CmsException(`Handoff ${this.entryId(entry)} has no onFinish`)
    }
    return getTargetCallback(entry.fields.onFinish, context)
  }

  private queue(entry: contentful.Entry<HandoffFields>): Queue | undefined {
    if (!entry.fields.queue) return undefined
    return this.queueDelivery.fromEntry(
      entry.fields.queue as contentful.Entry<QueueFields>
    )
  }

  private agent(
    entry: contentful.Entry<HandoffFields>
  ): HandoffAgent | undefined {
    if (!entry.fields.agent) return undefined
    const AGENT_EMAIL_TYPE = 'agentEmail'
    const AGENT_ID_TYPE = 'agentId'
    const model = ContentfulEntryUtils.getContentModel(
      entry.fields.agent
    ) as string
    switch (model) {
      case AGENT_EMAIL_TYPE: {
        const agent = entry.fields.agent as contentful.Entry<AgentEmailFields>
        return new HandoffAgentEmail(agent.fields.agentEmail)
      }
      case AGENT_ID_TYPE: {
        const agent = entry.fields.agent as contentful.Entry<AgentIdFields>
        return new HandoffAgentId(agent.fields.agentId)
      }
    }
    return undefined
  }

  fromEntry(
    entry: contentful.Entry<HandoffFields>,
    context: cms.Context
  ): cms.Handoff {
    const fields = entry.fields
    const common = ContentfulEntryUtils.commonFieldsFromEntry(entry)
    return addCustomFields(
      new cms.Handoff(
        common,
        this.onFinish(entry, context),
        fields.message,
        fields.failMessage,
        this.queue(entry),
        this.agent(entry),
        fields.shadowing
      ),
      fields,
      ['onFinish', 'agent', 'queue']
    )
  }
}

export interface AgentEmailFields {
  agentEmail: string
}

export interface AgentIdFields {
  agentId: string
}

type AgentTarget = contentful.Entry<AgentEmailFields | AgentIdFields>

export interface HandoffFields extends CommonEntryFields {
  message?: string
  failMessage?: string
  onFinish: CallbackTarget
  queue?: contentful.Entry<QueueFields>
  agent?: AgentTarget
  shadowing?: boolean
}
