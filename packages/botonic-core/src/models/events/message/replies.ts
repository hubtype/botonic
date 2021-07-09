export interface Reply {
  title: string
  payload: string
}

export interface WithReplies {
  replies?: Reply[]
}
