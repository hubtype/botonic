import type { HubtypeCaseContactReason } from '@botonic/core'

import type { HtContactReasonBranch } from './hubtype-fields/contact-reasons-conditional'

export function contactReasonMatchesBranch(
  sessionContactReason: HubtypeCaseContactReason,
  branch: HtContactReasonBranch
): boolean {
  return (
    sessionContactReason.project_id === branch.project_id &&
    sessionContactReason.name === branch.name
  )
}

export function findMatchingContactReasonBranch(
  sessionContactReasons: HubtypeCaseContactReason[],
  contactReasonBranches: HtContactReasonBranch[]
): HtContactReasonBranch | undefined {
  return contactReasonBranches.find(branch =>
    sessionContactReasons.some(sessionContactReason =>
      contactReasonMatchesBranch(sessionContactReason, branch)
    )
  )
}
