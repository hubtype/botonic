import { Contentful } from "./contentful/contentful";
import { CMS } from "./cms/cms";

// export { RichMessage } from './cms/model'
// export { Button } from './cms/model'
// export { Carousel } from './cms/model'

// export { CMS } from './cms/cms'
// export { Callback } from './cms/cms'

// export { Contentful } from './contentful/contentful'

// export { Renderer } from './render/render'


export default class BotonicPluginContentful {
  readonly contentful: CMS;

  constructor(options: any) {
    let contentful= new Contentful(options['spaceId'], options['accessToken']);
    this.contentful = contentful;
  }

  async pre({ input, session, lastRoutePath }) {
    return { input, session, lastRoutePath };
  }

  async post({ input, session, lastRoutePath, response }) {
    return { input, session, lastRoutePath, response };
  }
}
