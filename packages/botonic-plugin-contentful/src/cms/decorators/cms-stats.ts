// /* eslint-disable @typescript-eslint/unbound-method */
// import { MultiError } from 'async-parallel'
//
// import { SearchCandidate } from '../../search'
// import { reduceMultiError } from '../../util/async'
// import { AssetId, ContentId, ResourceId } from '../callback'
// import { CMS, ContentType, PagingOptions, TopContentType } from '../cms'
// import { Context, DEFAULT_CONTEXT } from '../context'
// import { CmsException } from '../exceptions'
// import {
//   Asset,
//   Button,
//   Carousel,
//   Chitchat,
//   CommonFields,
//   Content,
//   DateRangeContent,
//   Element,
//   Image,
//   Queue,
//   ScheduleContent,
//   StartUp,
//   Text,
//   TopContent,
//   Url,
// } from './contents'
//
// /**
//  * It validates the individually delivered contents, but not those fetched
//  * through contents/topContents
//  */
//
// class CallStat {
//   public calls = 0
//   public totalTimeMs = 0
//   constructor(public readonly key: string) {}
// }
// class Call {
//   constructor(public readonly key: string) {
//
//   }
// }
// class Stats {
//   private stats = new Map<string, CallStat>()
//   start(key: string): Call {
//     const call = new Call(key)
//   }
// }
// export class StatsCMS implements CMS {
//   private exceptionWrapper: ContentfulExceptionWrapper
//
//   static key(method: string, context: Context): string {
//     return [method, context.locale || 'default'].join('|')
//   }
//
//   constructor(readonly cms: CMS, readonly logger?: (msg: string) => void) {
//     this.exceptionWrapper = new ContentfulExceptionWrapper('CMS', logger)
//   }
//
//   private validate<C extends Content>(
//     content: C,
//     context: Context | undefined
//   ): C {
//     const validation = content.validate()
//     if (validation) {
//       const locale = context?.locale ? ` on locale '${context.locale}'` : ''
//       const msg = `${
//         content.contentType
//       } ${content.toString()}${locale}: ${validation}`
//       if (this.logger) this.logger(msg)
//       else console.error(msg)
//     }
//     return content
//   }
//
//   async contentStat<T extends Content>(
//     context: Context | undefined,
//     contentType: ContentType,
//     promise: Promise<T>
//   ): Promise<T> {
//     return promise
//       .catch(this.handleContentError(contentType, id, context))
//       .then(c => this.validate(c, context))
//   }
//
//   carousel(id: string, context?: Context): Promise<Carousel> {
//     return this.catchAndValidate(
//       id,
//       context,
//       ContentType.CAROUSEL,
//       this.cms.carousel(id, context)
//     )
//   }
//
//   text(id: string, context?: Context): Promise<Text> {
//     return this.catchAndValidate(
//       id,
//       context,
//       ContentType.TEXT,
//       this.cms.text(id, context)
//     )
//   }
//
//   chitchat(id: string, context?: Context): Promise<Chitchat> {
//     return this.catchAndValidate(
//       id,
//       context,
//       ContentType.CHITCHAT,
//       this.cms.chitchat(id, context)
//     )
//   }
//
//   startUp(id: string, context?: Context): Promise<StartUp> {
//     return this.catchAndValidate(
//       id,
//       context,
//       ContentType.STARTUP,
//       this.cms.startUp(id, context)
//     )
//   }
//
//   url(id: string, context?: Context): Promise<Url> {
//     return this.catchAndValidate(
//       id,
//       context,
//       ContentType.URL,
//       this.cms.url(id, context)
//     )
//   }
//
//   image(id: string, context?: Context): Promise<Image> {
//     return this.catchAndValidate(
//       id,
//       context,
//       ContentType.IMAGE,
//       this.cms.image(id, context)
//     )
//   }
//
//   queue(id: string, context?: Context): Promise<Queue> {
//     return this.catchAndValidate(
//       id,
//       context,
//       ContentType.QUEUE,
//       this.cms.queue(id, context)
//     )
//   }
//
//   button(id: string, context?: Context): Promise<Button> {
//     return this.catchAndValidate(
//       id,
//       context,
//       ContentType.BUTTON,
//       this.cms.button(id, context)
//     )
//   }
//
//   element(id: string, context?: Context): Promise<Element> {
//     return this.catchAndValidate(
//       id,
//       context,
//       ContentType.ELEMENT,
//       this.cms.element(id, context)
//     )
//   }
//
//   contentsWithKeywords(context?: Context): Promise<SearchCandidate[]> {
//     return this.cms
//       .contentsWithKeywords(context)
//       .catch(this.handleError('contentsWithKeywords', {}, context))
//   }
//
//   topContents<T extends TopContent>(
//     model: TopContentType,
//     context?: Context,
//     filter?: (cf: CommonFields) => boolean,
//     paging?: PagingOptions
//   ): Promise<T[]> {
//     return this.cms
//       .topContents<T>(model, context, filter, paging)
//       .catch(this.handleError('topContents', { model }, context))
//   }
//
//   content(id: string, context = DEFAULT_CONTEXT): Promise<Content> {
//     return this.cms
//       .content(id, context)
//       .catch(this.handleContentError('content' as ContentType, id, context))
//   }
//
//   contents<T extends Content>(
//     model: ContentType,
//     context?: Context,
//     paging?: PagingOptions
//   ): Promise<T[]> {
//     return this.cms
//       .contents<T>(model, context, paging)
//       .catch(this.handleError('contents', { model }, context))
//   }
//
//   assets(context?: Context): Promise<Asset[]> {
//     return this.cms
//       .assets(context)
//       .catch(this.handleError('assets', {}, context))
//   }
//
//   schedule(id: string, context?: Context): Promise<ScheduleContent> {
//     return this.cms
//       .schedule(id, context)
//       .catch(this.handleContentError(ContentType.SCHEDULE, id, context))
//   }
//
//   dateRange(id: string, context?: Context): Promise<DateRangeContent> {
//     return this.cms
//       .dateRange(id, context)
//       .catch(this.handleContentError(ContentType.DATE_RANGE, id, context))
//   }
//
//   asset(id: string, context?: Context): Promise<Asset> {
//     return this.cms
//       .asset(id, context)
//       .catch(this.handleResourceError(new AssetId(id, undefined), context))
//   }
//
//   private handleContentError(
//     contentType: ContentType,
//     id: string,
//     context: Context | undefined
//   ): (reason: any) => never {
//     return this.handleResourceError(ContentId.create(contentType, id), context)
//   }
//
//   private handleResourceError(
//     resourceId: ResourceId,
//     context: Context | undefined
//   ): (reason: any) => never {
//     return (reason: any) => {
//       throw this.exceptionWrapper.wrap(
//         reason,
//         resourceId.resourceType,
//         resourceId,
//         {},
//         context
//       )
//     }
//   }
//
//   private handleError(
//     method: string,
//     args: Record<string, any>,
//     context: Context | undefined
//   ): (reason: any) => never {
//     return (reason: any) => {
//       throw this.exceptionWrapper.wrap(reason, method, undefined, args, context)
//     }
//   }
// }
//
// export class ContentfulExceptionWrapper {
//   // TODO add logStack in plugin config
//   readonly logStack = true
//   constructor(
//     readonly wrappee: string,
//     readonly logger = (msg: string) => {
//       console.error(msg)
//     }
//   ) {}
//
//   wrap(
//     contentfulError: any,
//     method: string,
//     resourceId: ResourceId | undefined,
//     args: Record<string, any>,
//     context: Context | undefined
//   ): CmsException {
//     let content = ''
//     if (context?.locale) {
//       content += ` with locale '${context.locale}'`
//     }
//     if (resourceId) {
//       content += ` on '${resourceId.resourceType}' with id '${resourceId.id}'`
//     }
//     if (Object.keys(args).length) {
//       content += ` with args '${JSON.stringify(args)}'`
//     }
//     const msg = `Error calling ${this.wrappee}.${method}${content}.`
//     const exception = new CmsException(msg, contentfulError, resourceId)
//     const err = this.processError(contentfulError)
//     this.logger(`${msg} Due to ${err}`)
//
//     throw exception
//   }
//
//   processError(contentfulError: Error): string {
//     let err = ''
//     if (contentfulError instanceof MultiError) {
//       err += ' Due to:'
//       for (const e of reduceMultiError(contentfulError)) {
//         err += this.processError(e)
//       }
//     } else if (this.logStack && contentfulError.stack) {
//       err += contentfulError.stack.split('\n').slice(0, 5).join('\n')
//     } else {
//       err += `Due to '${contentfulError.message}'`
//     }
//     return err
//   }
// }
