---
id: webchat-markdown
title: Markdown
---

By default, webchat supports markdown syntax.

1. In one of your actions, enter the following example.

   ```javascript
   export default class extends React.Component {
     render() {
       const renderTable = () => {
         return (
           '## Tables\n' +
           '| Option | Description |\n' +
           '| ------ | ----------- |\n' +
           '| data   | path to data files to supply the data that will be passed into templates. |\n' +
           '| engine | engine to be used for processing templates. Handlebars is the default. |\n' +
           '| ext    | extension to be used for test files. |\n' +
           '<br/><br/>\n'
         )
       }
       return <Text>{renderTable()}</Text>
     }
   }

   export default class extends React.Component {
     render() {
       // markdown={true} is set by default
       return (
         <Text>
           # Heading 1{'\n'}
           ## Heading 2{'\n'}
           ### Heading3
         </Text>
       )
     }
   }
   ```

   <details>
   <summary>Output example</summary>

   ![](https://botonic-doc-static.netlify.com/images/markdown/mdwebchat1.png)

   </details>

2. Customize the style in the `index.js` file.

   **webchat/index.js**

   ```javascript
   theme: {
       markdownStyle: `
       * {
         margin: 0px;
       }
       a {
         text-decoration:none;
         font-weight:bold;
       }
       h1 {
         color: green;
       }
       h2 {
         color: purple;
       }
       a:visited {
         color: blue;
       }`,
     },
   ```

   <details>
   <summary>Output example</summary>

   ![](https://botonic-doc-static.netlify.com/images/markdown/mdwebchat2.png)

   </details>

**Multiline Support**

To use multiple line breaks, you must add
`</br>` tags in your `js` file, or use a function which returns `</br>` tags in the string.
You get an additional line break between "## Links Examples" and "---" separator.

```javascript
return (
  <Text>
    ## Links Examples
    <br />
    <br />
    {'\n'}---
    {'\n'}__Advertisement :)__
    {'\n'}- __[pica](https://nodeca.github.io/pica/demo/)__ - high quality and fast
    image resize in browser.
    {'\n'} - __[babelfish](https://github.com/nodeca/babelfish/)__ - developer
    friendly i18n with plurals support and easy syntax. You will like those
    projects!
    {'\n'}---
  </Text>
)
```

<details>
<summary>Example</summary>

![](https://botonic-doc-static.netlify.app/images/concepts_wmultiline.png)

</details>
