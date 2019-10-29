import { SearchResult } from '../search/search-result'
import { CMS, ModelType } from './cms'
import {
  Asset,
  Carousel,
  Text,
  Url,
  Image,
  Chitchat,
  Queue,
  Content,
  StartUp,
  CommonFields,
  ScheduleContent,
  DateRangeContent,
  TopContent,
} from './contents'
import { Context } from './context'

export class ErrorReportingCMS implements CMS {
  constructor(readonly cms: CMS) {}

  private validate<C extends Content>(content: C): C {
    const v = content.validate()
    if (v) {
      console.error(v)
    }
    return content
  }

  carousel(id: string, context?: Context): Promise<Carousel> {
    return this.cms
      .carousel(id, context)
      .catch(this.handleError(ModelType.CAROUSEL, id))
      .then(this.validate)
  }

  text(id: string, context?: Context): Promise<Text> {
    return this.cms
      .text(id, context)
      .catch(this.handleError(ModelType.TEXT, id))
      .then(this.validate)
  }

  chitchat(id: string, context?: Context): Promise<Chitchat> {
    return this.cms
      .text(id, context)
      .catch(this.handleError(ModelType.CHITCHAT, id))
      .then(this.validate)
  }

  startUp(id: string, context?: Context): Promise<StartUp> {
    return this.cms
      .startUp(id, context)
      .catch(this.handleError(ModelType.STARTUP, id))
      .then(this.validate)
  }

  url(id: string, context?: Context): Promise<Url> {
    return this.cms
      .url(id, context)
      .catch(this.handleError(ModelType.URL, id))
      .then(this.validate)
  }

  image(id: string, context?: Context): Promise<Image> {
    return this.cms
      .image(id, context)
      .catch(this.handleError(ModelType.IMAGE, id))
      .then(this.validate)
  }

  queue(id: string, context?: Context): Promise<Queue> {
    return this.cms
      .queue(id, context)
      .catch(this.handleError(ModelType.QUEUE, id))
      .then(this.validate)
  }

  contentsWithKeywords(context?: Context): Promise<SearchResult[]> {
    return this.cms
      .contentsWithKeywords(context)
      .catch(this.handleError('contentsWithKeywords'))
  }

  contents(
    model: ModelType,
    context?: Context,
    filter?: (cf: CommonFields) => boolean
  ): Promise<TopContent[]> {
    return this.cms
      .contents(model, context, filter)
      .catch(this.handleError('contents'))
  }

  schedule(id: string): Promise<ScheduleContent> {
    return this.cms.schedule(id).catch(this.handleError(ModelType.SCHEDULE, id))
  }

  dateRange(id: string): Promise<DateRangeContent> {
    return this.cms
      .dateRange(id)
      .catch(this.handleError(ModelType.DATE_RANGE, id))
  }

  asset(id: string): Promise<Asset> {
    return this.cms.asset(id).catch(this.handleError('asset', id))
  }

  private handleError(modelType: string, id?: string): (reason: any) => never {
    return (reason: any) => {
      const withId = id ? ` with id '${id}'` : ''
      if (reason.response && reason.response.data) {
        reason =
          reason.response.status + ': ' + JSON.stringify(reason.response.data)
      }
      // eslint-disable-next-line no-console
      console.error(`Error fetching ${modelType}${withId}: ${reason}`)
      throw reason
    }
  }
}
