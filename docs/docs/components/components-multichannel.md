---
id: multichannel
title: Multichannel
---

## Purpose

The `Multichannel` component is a wrapper component used to transform existing representations of a channel into another one that does not support it natively. 
As an example, it can be used to adapt native representations of a Text with Buttons or Carousel (available in Facebook) for WhatsApp : the multichannel component allows you to provide a way to concatenate and unify messages and conversations for your WhatsApp bot.

To use it, you just have to add the following code in your `action` files, under the `render` section.

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

## Properties

| Property               | Type                                 | Description                                                                                                                            | Required | Default value |
|------------------------|--------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------|----------|---------------|
| children               | Botonic Component                    | Enable the multichannel                                                                                                                | Yes      | -             |
| firstIndex             | Number, letter or undefined          | Enable the display of the list of options with numbers or letters. Examples: firstIndex={"a"} gives a.b. and firstIndex={1} gives 1.2. | No       | 1             |
| boldIndex              | Boolean                              | Apply a bold format to the index element                                                                                               | No       | False         |
| carousel: indexMode    | String | Add a letter or number to the index for a carousel. Accepted values: 'letter', 'number' or undefined (no index)                                                                                    | No       | Undefined     |
| carousel: showTitle    | Boolean                              | -                                                                                                                                      | No       | -             |
| carousel: showSubtitle | Boolean                              | -                                                                                                                                      | No       |         -      |
| text: Index            | String                               |                                                                                                                                        | No       |       -        |
| text: IndexMode        | String | Add a letter or number to the index for a text. Accepted values: 'letter', 'number' or undefined (no index)                                                                                         | No       | letter        |
| text: Newline          | String                               |                                                                                                                                        | No       |    -           |
| Indexseparator         |               String                       |        Add a character after the letter or number.  Example: a dot or dash                                                                                                                              |    No      |    ‘ . ‘           |
|    Message separator                    |        String                              |       Add a space between the various messages. {'\n\n'} adds a line break between the index message and the selection option                                                                                                                                 |     No     |       ‘ \n ’        |
                      


### Example

As an output, you would get something like this: 

```javascript
<Multichannel
        text={{ indexMode: 'number' }}
        carousel={{ showTitle: true, ... }}
        indexSeparator='.'
        messageSeparator={null}
      >
  <Text>
    Some with buttons
      <Button key={'1'} payload='payload1'>
        Button 1
      </Button>
      <Button key={'2'} path='path1'>
        Button 2
      </Button>
      <Button key={'3'} url='http://testurl.com'>
        Visit website
      </Button>
  </Text>
</Multichannel>
```
