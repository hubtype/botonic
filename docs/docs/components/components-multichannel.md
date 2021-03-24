---
id: multichannel
title: Multichannel
---

## Purpose

The `Multichannel` component is a wrapper component used to transform existing representations of a channel into another one that does not support it natively. 
As an example, it can be used to adapt native representations of a Text with Buttons or Carousel (available in Facebook) for WhatsApp : the multichannel component allows you to provide a way to concatenate and unify messages and conversations for your WhatsApp bot.

## Example

To get this kind of output:

<img src="https://botonic-doc-static.netlify.com/images/multichannel/multichannel-visuals.png" width="600"/>


You just have to add the following code in your `action` files, under the `render` section.

```javascript
<Multichannel
  text={{ indexMode: 'number' }}
  indexSeparator={':'}
  messageSeparator={'\n'}
>
```


As an example, you would get something like this: 

```javascript
<Multichannel>
  <Text>
    Welcome! Choose from the options below.
      <Button key={'1'} payload='payload1'>
        Option 1
      </Button>,
      <Button key={'2'} payload='payload1'>
        Option 2
      </Button>,
      <Button key={'3'} payload='payload1'>
        Option 3
      </Button>
  </Text>
</Multichannel>
```

## Properties

You can customize the output by using this list of properties.

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
                      






