export type LinkType = 'Asset' | 'Entry'

export class EntryLink {
  constructor(
    public id: string,
    public linkType: LinkType
  ) {}
}

export const QUICK_REPLY = 'QuickReplies'
export const BUTTON = 'Buttons'
