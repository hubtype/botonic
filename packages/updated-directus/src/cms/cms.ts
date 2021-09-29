import {
  ButtonFields,
  ImageFields,
  TextFields,
} from '../directus/manage/directus-contents'
import { Button, Text, Image, Content } from './contents'

export enum MessageContentType {
  TEXT = 'text',
  IMAGE = 'image',
}

export enum NonMessageContentType {
  QUEUE = 'queue',
  PAYLOAD = 'payload',
}

export enum SubContentType {
  BUTTON = 'button',
}

export enum SupportedLocales {
  SPANISH = 'es-ES',
  ENGLISH = 'en-US',
  ITALIAN = 'it-IT',
}

export type TopContentType = MessageContentType | NonMessageContentType

export type ContentType = TopContentType | SubContentType

export interface CMS {
  button(id: string, context: SupportedLocales): Promise<Button>

  image(id: string, context: SupportedLocales): Promise<Image>

  text(id: string, context: SupportedLocales): Promise<Text>

  contentsWithKeywords(input: string): Promise<string[]>

  topContents(
    contentType: ContentType,
    context: SupportedLocales
  ): Promise<Content[]>

  deleteContent(
    context: SupportedLocales,
    contentType: ContentType,
    id: string
  ): Promise<void>

  createContent(
    context: SupportedLocales,
    contentType: ContentType,
    id: string
  ): Promise<void>

  updateTextFields(
    context: SupportedLocales,
    id: string,
    fields: TextFields
  ): Promise<void>

  updateButtonFields(
    context: SupportedLocales,
    id: string,
    fields: ButtonFields
  ): Promise<void>

  updateImageFields(
    context: SupportedLocales,
    id: string,
    fields: ImageFields
  ): Promise<void>
}
