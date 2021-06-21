import * as contentful from 'contentful'

import * as cms from '../../cms'
import {
  ContentType,
  HandoffAgentEmail,
  HandoffAgentId,
  HandoffDestination,
  HandoffQueue,
  OnFinish,
} from '../../cms'
import { DeliveryApi } from '../delivery-api'
import {
  addCustomFields,
  CommonEntryFields,
  ContentfulEntryUtils,
} from '../delivery-utils'
import { CallbackTarget, getTargetCallback } from './callback-delivery'
import { DeliveryWithFollowUp } from './follow-up'
import { QueueDelivery, QueueFields } from './queue'

export class HandoffDelivery extends DeliveryWithFollowUp {
  static REFERENCES_INCLUDE = QueueDelivery.REFERENCES_INCLUDE + 1
  constructor(
    delivery: DeliveryApi,
    private readonly queue: QueueDelivery,
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
  ): OnFinish | undefined {
    if (entry.fields.onFinish) {
      return getTargetCallback(entry.fields.onFinish, context)
    }
    return undefined
  }

  private destination(
    entry: contentful.Entry<HandoffFields>
  ): HandoffDestination | undefined {
    if (!entry.fields.destination) return undefined
    const AGENT_EMAIL_TYPE = 'agentEmail'
    const AGENT_ID_TYPE = 'agentId'
    const model = ContentfulEntryUtils.getContentModel(
      entry.fields.destination
    ) as string
    switch (model) {
      case ContentType.QUEUE:
        return new HandoffQueue(
          this.queue.fromEntry(
            entry.fields.destination as contentful.Entry<QueueFields>
          )
        )
      case AGENT_EMAIL_TYPE: {
        const destination = entry.fields
          .destination as contentful.Entry<AgentEmailFields>
        return new HandoffAgentEmail(destination.fields.agentEmail)
      }
      case AGENT_ID_TYPE: {
        const destination = entry.fields
          .destination as contentful.Entry<AgentIdFields>
        return new HandoffAgentId(destination.fields.agentId)
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
        fields.text,
        this.onFinish(entry, context),
        this.destination(entry),
        fields.shadowing
      ),
      fields,
      ['onFinish', 'destination']
    )
  }
}

export interface AgentEmailFields {
  agentEmail: string
}

export interface AgentIdFields {
  agentId: string
}

type DestinationTarget = contentful.Entry<
  QueueFields | AgentEmailFields | AgentIdFields
>

export interface HandoffFields extends CommonEntryFields {
  text: string
  destination?: DestinationTarget
  onFinish?: CallbackTarget
  shadowing?: boolean
}
