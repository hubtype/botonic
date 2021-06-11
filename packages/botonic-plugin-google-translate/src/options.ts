export interface Credentials {
  projectId: string
  privateKeyId: string
  privateKey: string
  clientEmail: string
}

export interface PluginOptions {
  credentials: Credentials
  translateTo: string[]
  whitelist?: string[]
}
