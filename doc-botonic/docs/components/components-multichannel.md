---
id: multichannel
title: Multichannel
---

## Purpose

The multichannel component allows you to provide a way to concatenate and unify messages and conversation for your WhatsApp bot.

In this way, the bot can avoid "spamming" the conversation and just sends one long message with the relevant text only.

## Code

Add the following code in your `action` files, under the `render` section.

```javascript
<Multichannel
        firstIndex={'a'}
        boldIndex={true}
        carousel={{ indexMode: 'letter' }}
        text={{ indexMode: 'letter' }}
        indexSeparator={'.'}
        messageSeparator={'\n\n'}
      >
```

## Description

- `firstIndex` = The index is the option title of a choice. Ex: a. b. or 1. 2. etc.

- `boldIndex`: Applies a bold format to the index element. True or False.

- `Carousel`: Adds a letter or number to the index for a carousel.

- `Text` : Adds a letter or number to the index for a text.

- `Indexseparator`: Adds a dot or dash after the letter or number.

- `Message separator` : Adds a space between the various messages. `{'\n\n'}` adds a line break between the index message and the selection option.

## Example

````javascript
      <Multichannel {...LEGACY_PROPS}>
        <Text>
          Some with buttons
          {[
            <Button key={'1'} payload='payload1'>
              Button 1
            </Button>,
            <Button key={'2'} path='path1'>
              Button 2
            </Button>,
            <Button key={'3'} url='http://testurl.com'>
              Visit website
            </Button>,
          ]}
        </Text>
      </Multichannel>
    )
    ```
````
