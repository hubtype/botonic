//Dialogflow types
export interface Credentials {
  private_key_id: string
  private_key: string
  client_email: string
  project_id: string
}

export type Options = {
  credentials: Credentials
  queryData?: Record<string, any>
}
