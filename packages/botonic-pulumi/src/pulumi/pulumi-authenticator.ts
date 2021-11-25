export interface PulumiAuthenticator {
  binary: string
  doLogin(): void
}
