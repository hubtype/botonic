import { INPUT } from '@botonic/core'
import { describe, expect, test } from 'vitest'

import {
  contactReasonMatchesBranch,
  findMatchingContactReasonBranch,
} from '../src/content-fields/contact-reasons-conditional-matcher'
import { FlowContactReasonsConditional } from '../src/content-fields/flow-contact-reasons-conditional'
import type { HtContactReasonBranch } from '../src/content-fields/hubtype-fields/contact-reasons-conditional'
import { HtNodeWithContentType } from '../src/content-fields/hubtype-fields/node-types'
import { createRequest } from './helpers/utils'

const branchTarget = {
  id: 'matched-target-id',
  type: HtNodeWithContentType.TEXT,
}

const defaultTarget = {
  id: 'default-target-id',
  type: HtNodeWithContentType.TEXT,
}

const billingBranch: HtContactReasonBranch = {
  id: 'reason-billing-id',
  name: 'billing',
  project_id: 'project-1',
  project_name: 'Project 1',
  target: branchTarget,
}

const supportBranch: HtContactReasonBranch = {
  id: 'reason-support-id',
  name: 'support',
  project_id: 'project-1',
  project_name: 'Project 1',
  target: {
    id: 'support-target-id',
    type: HtNodeWithContentType.TEXT,
  },
}

describe('contactReasonMatchesBranch', () => {
  test('returns true when project_id and name match the branch', () => {
    expect(
      contactReasonMatchesBranch(
        {
          id: 'different-session-id',
          name: 'billing',
          project_id: 'project-1',
        },
        billingBranch
      )
    ).toBe(true)
  })

  test('returns false when only name matches', () => {
    expect(
      contactReasonMatchesBranch(
        {
          id: 'session-id',
          name: 'billing',
          project_id: 'other-project',
        },
        billingBranch
      )
    ).toBe(false)
  })

  test('returns false when only project_id matches', () => {
    expect(
      contactReasonMatchesBranch(
        {
          id: 'session-id',
          name: 'other-name',
          project_id: 'project-1',
        },
        billingBranch
      )
    ).toBe(false)
  })
})

describe('findMatchingContactReasonBranch', () => {
  test('returns the first branch that matches any session contact reason', () => {
    const result = findMatchingContactReasonBranch(
      [
        {
          id: 'unrelated-id',
          name: 'unrelated',
          project_id: 'project-1',
        },
        {
          id: 'reason-support-id',
          name: 'support',
          project_id: 'project-1',
        },
      ],
      [billingBranch, supportBranch]
    )

    expect(result).toBe(supportBranch)
  })

  test('returns undefined when there is no match', () => {
    const result = findMatchingContactReasonBranch(
      [
        {
          id: 'unknown-id',
          name: 'unknown',
          project_id: 'project-1',
        },
      ],
      [billingBranch, supportBranch]
    )

    expect(result).toBeUndefined()
  })
})

describe('FlowContactReasonsConditional.setFollowUp', () => {
  test('sets followUp to the target of the matching contact reason branch', () => {
    const botContext = createRequest({
      input: { data: 'test', type: INPUT.TEXT },
    })
    botContext.session._hubtype_case_contact_reasons = [
      {
        id: 'reason-billing-id',
        name: 'billing',
        project_id: 'project-1',
      },
    ]

    const flowContactReasonsConditional =
      FlowContactReasonsConditional.fromHubtypeCMS(
        {
          id: 'contact-reasons-node-id',
          code: 'CONTACT_REASONS',
          meta: { x: 0, y: 0 },
          flow_id: 'flow-id',
          is_meaningful: false,
          type: HtNodeWithContentType.CONTACT_REASONS_CONDITION,
          content: {
            contact_reasons: [billingBranch, supportBranch],
            default_target: defaultTarget,
          },
        },
        botContext
      )

    expect(flowContactReasonsConditional.followUp).toEqual(branchTarget)
    expect(flowContactReasonsConditional.conditionalResult).toBe('billing')
  })

  test('sets followUp to default_target when there is no matching branch', () => {
    const botContext = createRequest({
      input: { data: 'test', type: INPUT.TEXT },
    })
    botContext.session._hubtype_case_contact_reasons = [
      {
        id: 'unknown-id',
        name: 'unknown',
        project_id: 'project-1',
      },
    ]

    const flowContactReasonsConditional =
      FlowContactReasonsConditional.fromHubtypeCMS(
        {
          id: 'contact-reasons-node-id',
          code: 'CONTACT_REASONS',
          meta: { x: 0, y: 0 },
          flow_id: 'flow-id',
          is_meaningful: false,
          type: HtNodeWithContentType.CONTACT_REASONS_CONDITION,
          content: {
            contact_reasons: [billingBranch, supportBranch],
            default_target: defaultTarget,
          },
        },
        botContext
      )

    expect(flowContactReasonsConditional.followUp).toEqual(defaultTarget)
    expect(flowContactReasonsConditional.conditionalResult).toBe('default')
  })

  test('sets followUp to default_target when session has no contact reasons', () => {
    const botContext = createRequest({
      input: { data: 'test', type: INPUT.TEXT },
    })

    const flowContactReasonsConditional =
      FlowContactReasonsConditional.fromHubtypeCMS(
        {
          id: 'contact-reasons-node-id',
          code: 'CONTACT_REASONS',
          meta: { x: 0, y: 0 },
          flow_id: 'flow-id',
          is_meaningful: false,
          type: HtNodeWithContentType.CONTACT_REASONS_CONDITION,
          content: {
            contact_reasons: [billingBranch, supportBranch],
            default_target: defaultTarget,
          },
        },
        botContext
      )

    expect(flowContactReasonsConditional.followUp).toEqual(defaultTarget)
    expect(flowContactReasonsConditional.conditionalResult).toBe('default')
  })
})
