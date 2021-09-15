import { Button, Text, Image } from './contents'

export enum ContentType {
  TEXT = 'text',
  BUTTON = 'button',
  IMAGE = 'image',
}

export enum SupportedLocales {
  SPANISH = 'es-ES',
  ENGLISH = 'en-US',
  ITALIAN = 'it-IT',
}

export interface CMS {
  button(id: string, context: SupportedLocales): Promise<Button>

  image(id: string, context: SupportedLocales): Promise<Image>

  text(id: string, context: SupportedLocales): Promise<Text>
}
