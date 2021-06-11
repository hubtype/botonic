export interface Credentials {
  projectId: string
  privateKeyId: string
  privateKey: string
  clientEmail: string
}

export interface PluginOptions {
  whitelist?: string[]
  credentials: Credentials
}
