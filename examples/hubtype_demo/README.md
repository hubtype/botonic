## Set up

npm i -g contentful-cli
npm i package.json

### Import space to Contentful:

Create an account into Contentful

Once registered, you need to fill the document `bin/credentials` and then do the followint steps: - STAGING_SPACE: you need to set the id of your space ID (Inside Contentful in 'settings-general settings') - MNGMT_TOKEN: token for having access to get/post data to Contentful (Inside Contentful in 'Settings-ApiKeys-Contet management tokens')

Save the document and open a terminal into your project and execute the following code:

```
cd bin
./import_contentful.sh
```

Now, in Contentful you should have new Content model objects.

### Connect our bot project with Contentful

Open the file `src/config.ts`. Here we will define all our configurations. - The `spaceId` is the same value that we set before in the `bin/credentials` file. - The `accessToken` is a new value, in order to get it, go to Contentful in `Settings-ApiKeys-Content delivery/preview tokens` and press the `Add API key` in the right.

### Create a Hello World Text example

In Contentful, go to the Tab `Content`, click on `Add entry` and select `Text` type:

Fill the field `FAQ ID` which will be the name that represents this text, it DOES NOT affect in the bot.
In the field `Text` put your text, for example `Hello world!`.

Press the `Publish` button in the right.
Now, we need to find the identifier of this component. In order to get that, please click in the `Info` button in the top.

Tha `Entry ID` is the value that we will store in order to get this `Text` component from the bot.

Open the bot project folder, and go to the `src/actions/constants.ts` file. We will store all the Contentful identifiers here.

Fill the `INITIAL_TEXT_ID` value with the `Entry ID` that we got before.

Right now, the action `src/actions/greetings.tsx` will get the text from this `Entry ID`.

### Try it!

In the terminal, run `botonic serve`!

### Support

Join our Slack channel https://slack.botonic.io/ and ask for help!
