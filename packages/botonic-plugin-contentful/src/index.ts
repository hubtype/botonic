import * as cms from './cms';
import Contentful from './contentful';
import Intents from './intents';
import { Renderer } from './render';

// Exports
export * from './cms';
export * from './render';
export * from './intents';
export * from './time';

export interface CmsOptions {
  cms?: cms.CMS;
  renderer?: Renderer;
  intents?: Intents;
}

export interface ContentfulOptions {
  spaceId: string;
  accessToken: string;
  renderer?: Renderer;
  intents?: Intents;
}

export default class BotonicPluginContentful {
  readonly cms: cms.CMS;

  readonly renderer: Renderer;

  readonly intents: Intents;

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
    this.intents = options.intents || new Intents(this.cms);
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
