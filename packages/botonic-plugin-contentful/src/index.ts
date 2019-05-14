import Contentful from './contentful';
import * as cms from './cms';
import { Renderer } from './render';
import { Keywords } from './keywords';

// Exports
export * from './cms';
export * from './render';

export default class BotonicPluginContentful {
  readonly cms: cms.CMS;

  readonly renderer: Renderer;

  readonly keywords: Keywords;

  constructor(options: any) {
    if (options.cms) {
      this.cms = options.cms;
    } else {
      this.cms = new Contentful(options.spaceId, options.accessToken);
    }
    this.cms = new cms.ErrorReportingCMS(this.cms);
    this.renderer = options.renderer || new Renderer();
    this.keywords = options.keywords || new Keywords(this.cms);
  }

  async suggestTextsForInput(
    inputText: string,
    keywordsFoundTextId: string,
    keywordsNotFoundTextId: string
  ): Promise<cms.Text> {
    return this.keywords.suggestTextsForInput(
      inputText,
      keywordsFoundTextId,
      keywordsNotFoundTextId
    );
  }

  // @ts-ignore
  async pre({ input, session, lastRoutePath }) {
    return { input, session, lastRoutePath };
  }

  // @ts-ignore
  async post({ input, session, lastRoutePath, response }) {
    return { input, session, lastRoutePath, response };
  }
}
