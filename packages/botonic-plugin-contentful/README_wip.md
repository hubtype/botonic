# Usage
 See [documentation](https://docs.botonic.io/plugins/plugin-contentful)

# Deploy
## Reduce bundle size
 To reduce the size of the bots using this plugin, you can use one of the techniques described at
 this [article](https://medium.com/@Memija/less-is-more-with-moment-and-moment-timezone-d7afbab34df3),
 such as using the plugins moment-locales-webpack-plugin and moment-timezone-data-webpack-plugin.

# Design
 See [diagram](/packages/botonic-plugin-contentful/doc/class-diagram.png). Exported from https://www.draw.io/#G1fMaHqDYF-DsGWC6JrCWvo6f7Psx7Vpzw

# Content Management
## Export 
Install cli:
```
npm install -g contentful-cli
```

Generate personal token from https://app.contentful.com/spaces/p2iyhzd1u4a7/api/cma_tokens and run
````
contentful space export --space-id=p2iyhzd1u4a7 --management-token=xxx --download-assets
````
