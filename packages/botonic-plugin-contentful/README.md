# Botonic Plugin Contentful

## What Does This Plugin Do?

Botonic Plugin Contentful is one of the [available](https://github.com/hubtype/botonic/tree/master/packages) plugins for Botonic.
[Contentful](http://www.contentful.com) is a CMS (Content Management System) which manages contents of a great variety
of types, such as text, dates, numerics, images, ... These simple contents can be combined into custom complex contents (eg. a carousel or a message box) which can be queried over APIs. 

*Features*
* Web dashboard for defining complex contents and validation rules for their values
* Web dashboard for creating, navigating and querying the custom contents
* Multilanguage content values
* Content values history revision
* Role management
* Migration and backup tools

*Advantages*
* The contents and navigation of static menus, images and texts can be easily defined from a user-friendly UI.
* Benefiting from of a best in breed CMS solution.
* Updating the bot contents does not require redeploying the bot.
* Users will need to download a much lighter bundle to start using the bot.

Currently the Contentful plugin allows your bot to easily access this kind of contents:
* Combinations of the following Botonic UI components: Start up messages, Carousels and Texts. Their buttons can be configured
  to trigger other botonic components as well as opening external URLs.
* Images, which optionally can be assigned to different assets depending on the user language.
* Information about Botonic desk queues, such as its name and schedule.

For the previous content, the dashboard allows assigning a list of tags to your contents, so that your bot can query them by a given tag value.

* Schedules with configurable timing per week day, as well as exception for bank holidays or sales periods.
* Any kind of files uploaded to your Contentful account.

## Setup

### Create a Contentful Account

1. Create an account at www.contentful.com and select **Create an empty space**.
2. Go to the **General Settings** page and write down the space ID number.
3. Create a Delivery API token and safely store its value (it grants read access to your account).
4. Create a Content Management token and click on **Generate personal token** to safely store its value (it grants write access to your account).

### Install the Plugin

1. Install the plugin in your bot's project by running :

```bash
npm install @botonic/plugin-contentful
```

2. Execute the following script to create content models required by the plugin. Replaced YOUR\_ID and YOUR\_TOKEN with
the space id and token that you obtained in the previous section.

```
CONTENTFUL_SPACEID=<YOUR_ID> CONTENTFUL_TOKEN=<CONTENT_MANAGEMENT_TOKEN> node_modules/@botonic/plugin-contentful/bin/import-contentful-models.sh
```

## Use

### Define Your Contents

#### Publishing Contents

1. Go to the Contentful dashboard. 
2. Open the "Contents section" and create the contents required by your bot. 

Remember that they will not be available until you press the "publish" button and the button becomes green.

#### Buttons

The content buttons may trigger different behaviours depending on the type of its *target* field:

* If you assign a *StartUp*, *Text* or *Carousel*, the button text will be automatically assigned to the *Short Text* field of the target content. When the button is pressed, it will send your bot a payload with value "\<MODEL_TYPE\>$\<ID\>". \<MODEL\_TYPE\> may be *startUp*, *text* or *carousel*, whereas \<ID\> will be the ID of the target.
* If you assign a URL, the browser will open it when the button is pressed.
* In two cases you should assign a *Button* target. 1) When you want the button to have a text different than the target content's *Short Text*. 2) When you want to assign a custom *Payload* to trigger a bot action.

1. either create a new entry.
2. or link an existing one (which may be shared by other buttons).

In the case of Text's, you can also define *Follow Up* contents. This feature is used to automatically display a second message after a timeout. This can be used to ask the user to rate the bot, to display again the main carousel, ...

#### Internationalization

To internationalize your bot, first define the list of required languages at the Settings|Locales menu of you Contentful space. It's recommended to define fallback locales, in case that any content lacks the translation text for some reason.
From the content edit page, click on "Change" at the translation section to enable the required languages.

You will see now that you can assign multiple values for the fields that can be internationalized (as defined at your content model).

The value of referenced contents (eg. a list of Button's) are not defined for a given locale,
the plugin will deliver them as defined for the locale's fallback locale. In that case, the
referenced contents will be delivered in the same locale as the referring content.

### Program Your Bot

Add the following to you bot's plugins.js file:

```
export const plugins = [
...
  {
    id: 'contentful',
    resolve: contentful,
    options: {
               spaceId = <YOUR_CONTENTFUL_SPACEID>;
               accessToken = <DELIVERY_API_TOKEN>;
             }
  },
...
```

#### Rendering a Contentful Content With Botonic React

To render a botonic *StartUp*, *Texts* and *Carousels* with the contents configured at contentful space:

1) Create the following functions, which convert the result from the Contentful plugin to react components (They are not
implemented within the Contentful plugin to keep the plugin fully decoupled from React)

```
import * as cms from '@botonic/plugin-contentful';
import { msgsToBotonic } from '@botonic/react';

const converter = new cms.BotonicMsgConverter();

export function renderText(text) {
  const msg = converter.text(text);
  return msgsToBotonic(msg);
}

export function renderCarousel(carousel) {
  const msg = converter.carousel(carousel);
  return msgsToBotonic(msg);
}

export function renderStartUp(startUp: cms.StartUp): React.ReactNode {
  const msg = converter.startUp(startUp);
  return msgsToBotonic(msg);
}
```

2) render it from your actions. To obtain \<YOUR TEXT CONTENT ID\>, open the content at www.contentful.com and click the
"Info" button on the top right corner and copy the "ENTRY ID" value.

```
import * as cms from '@botonic/plugin-contentful';
import * as React from 'react';
import { renderText } from './render'; // the file created on previous step

export default class Text extends React.Component {
  static displayName = 'Text';

  static async botonicInit(init) {
    const plugin: cms.default = init.plugins.contentful;

    let text = await plugin.cms.text(<YOUR TEXT CONTENT ID>);
    return { text };
  }

  render() {
    return renderText(this.props['text']);
  }
}
```

*plugin.cms.text(id)* returns an object with all the fields configured at www.contentful.com. Instead of directly passing it to the renderText function, you can also process them according to your requirements (eg. you could be just interested on the text field).

3) to render the content assigned to the buttons at the Contentful dashboard,
you we'll need to assign these routes:

```
import * as cms from '@botonic/plugin-contentful';
....

 {
    payload: cms.ContentCallback.regexForModel(cms.ModelType.TEXT),
    action: Text
  },
  {
    payload: cms.ContentCallback.regexForModel(cms.ModelType.CAROUSEL),
    action: Carousel
  },
```

And define an action for each route like this:

```
export default class Text extends React.Component {

  static async botonicInit(init: ActionInitInput) {
    const plugin: cms.default = init.plugins.contentful;

    const callback = cms.ContentCallback.ofPayload(init.input.payload);
    let text = await botoplugin.cms.text(callback.id);
    return { text };
  }

   render() {
    return renderText(this.props['text']);
  }
```


### Deploy
#### Reduce bundle size
 To reduce the size of the bots using this plugin, you can use one of the techniques described at
 this [article](https://medium.com/@Memija/less-is-more-with-moment-and-moment-timezone-d7afbab34df3),
 such as using the plugins moment-locales-webpack-plugin and moment-timezone-data-webpack-plugin.

### Design
 See [diagram](/packages/botonic-plugin-contentful/doc/class-diagram.png). Exported from https://www.draw.io/#G1fMaHqDYF-DsGWC6JrCWvo6f7Psx7Vpzw

### Content Management
#### Export 
Install cli:
```
npm install -g contentful-cli
```

Generate personal token from https://app.contentful.com/spaces/p2iyhzd1u4a7/api/cma_tokens and run
````
contentful space export --space-id=p2iyhzd1u4a7 --management-token=xxx --download-assets
````
Fore more details, see [Botonic documentation](https://botonic.io/docs.html) 
