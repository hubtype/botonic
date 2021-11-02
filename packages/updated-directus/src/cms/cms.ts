import { Stream } from 'stream'

import {
  ButtonFields,
  CarouselFields,
  ElementFields,
  ImageFields,
  TextFields,
} from '../directus/manage/directus-contents'
import { Button, Carousel, Content, Image, Text, Url } from './contents'

export enum MessageContentType {
  TEXT = 'text',
  IMAGE = 'image',
  CAROUSEL = 'carousel',
}

export enum NonMessageContentType {
  QUEUE = 'queue',
  PAYLOAD = 'payload',
  URL = 'url',
}

export enum SubContentType {
  BUTTON = 'button',
  ELEMENT = 'element',
}

export enum SupportedLocales {
  SPANISH = 'es-ES',
  ENGLISH = 'en-US',
  ITALIAN = 'it-IT',
  GERMAN = 'de-DE',
}

export type TopContentType = MessageContentType | NonMessageContentType

export const TopContentType = {
  ...MessageContentType,
  ...NonMessageContentType,
}

export type ContentType = TopContentType | SubContentType

export const ContentType = { ...TopContentType, ...SubContentType }

export interface CMS {
  button(id: string, context: SupportedLocales): Promise<Button>

  image(id: string, context: SupportedLocales): Promise<Image>

  text(id: string, context: SupportedLocales): Promise<Text>

  url(id: string, context: SupportedLocales): Promise<Url>

  carousel(id: string, context: SupportedLocales): Promise<Carousel>

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

  updateCarouselFields(
    context: SupportedLocales,
    id: string,
    fields: CarouselFields
  ): Promise<void>

  updateElementFields(
    context: SupportedLocales,
    id: string,
    fields: ElementFields
  ): Promise<void>

  createAsset(
    context: SupportedLocales,
    file: string | ArrayBuffer | Stream,
    fields: ImageFields
  ): Promise<void>
}
