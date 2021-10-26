/* eslint-disable @typescript-eslint/naming-convention */
//Dialogflow types
export interface Credentials {
  private_key_id: string
  private_key: string
  client_email: string
  project_id: string
}

export type Options = {
  credentials: Credentials
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  queryData?: Record<string, any>
}
