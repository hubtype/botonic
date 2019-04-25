import Contentful from './contentful';
import { CMS, ErrorReportingCMS } from './cms';
import { Renderer } from './render';

// Exports
export * from './cms';
export * from './render';

export default class BotonicPluginContentful {
  readonly cms: CMS;

  readonly renderer: Renderer;

  constructor(options: any) {
    if (options.cms) {
      this.cms = options.cms;
    } else {
      this.cms = new Contentful(options.spaceId, options.accessToken);
    }
    this.cms = new ErrorReportingCMS(this.cms);
    this.renderer = options.renderer || new Renderer();
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
