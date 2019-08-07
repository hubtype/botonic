import * as cms from './cms';
import Contentful from './contentful';
import { Search } from './search';
import { BotonicMsgConverter } from './render';

interface OptionsBase {
  renderer?: BotonicMsgConverter;
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

  readonly renderer: BotonicMsgConverter;

  readonly search: Search;

  constructor(options: CmsOptions | ContentfulOptions) {
    const optionsAny = options as any;
    if (optionsAny.cms) {
      this.cms = optionsAny.cms;
    } else {
      const contOptions = options as ContentfulOptions;
      this.cms = new Contentful(contOptions.spaceId, contOptions.accessToken);
    }
    this.cms = new cms.ErrorReportingCMS(this.cms);
    this.renderer = options.renderer || new BotonicMsgConverter();
    this.search = options.search || new Search(this.cms);
  }

  // @ts-ignore
  pre({ input, session, lastRoutePath }) {}

  // @ts-ignore
  post({ input, session, lastRoutePath, response }) {}
}
