import Contentful from './contentful';
import * as cms from './cms';
import { Renderer } from './render';
import { Keywords } from './keywords';

// Exports
export * from './cms';
export * from './render';
export * from './keywords';

export interface CmsOptions {
  cms?: cms.CMS;
  renderer?: Renderer;
  keywords?: Keywords;
}

export interface ContentfulOptions {
  spaceId: string;
  accessToken: string;
  renderer?: Renderer;
  keywords?: Keywords;
}

export default class BotonicPluginContentful {
  readonly cms: cms.CMS;

  readonly renderer: Renderer;

  readonly keywords: Keywords;

  constructor(options: CmsOptions | ContentfulOptions) {
    let optionsAny = options as any;
    if (optionsAny.cms) {
      this.cms = optionsAny.cms;
    } else {
      let contOptions = options as ContentfulOptions;
      this.cms = new Contentful(contOptions.spaceId, contOptions.accessToken);
    }
    this.cms = new cms.ErrorReportingCMS(this.cms);
    this.renderer = options.renderer || new Renderer();
    this.keywords = options.keywords || new Keywords(this.cms);
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
