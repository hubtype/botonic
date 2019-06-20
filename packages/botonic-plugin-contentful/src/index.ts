import * as cms from './cms';
import Contentful from './contentful';
import { Search } from './search';
import { Renderer } from './render';

// Exports
export * from './cms';
export * from './nlp';
export * from './render';
export * from './search';
export * from './time';

interface OptionsBase {
  renderer?: Renderer;
  search?: Search;
}

export interface CmsOptions extends OptionsBase {
  cms?: cms.CMS;
}

export interface ContentfulOptions extends OptionsBase {
  spaceId: string;
  accessToken: string;
}

export default class BotonicPluginContentful {
  readonly cms: cms.CMS;

  readonly renderer: Renderer;

  readonly search: Search;

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
    this.search = options.search || new Search(this.cms);
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
