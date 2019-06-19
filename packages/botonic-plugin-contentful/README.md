# Design
 See [diagram](./doc/class-diagram.png). Exported from https://www.draw.io/#G1fMaHqDYF-DsGWC6JrCWvo6f7Psx7Vpzw
# Management
## Export 
Install cli:
```
npm install -g contentful-cli
```

Generate personal token from https://app.contentful.com/spaces/5wh7etpd1y84/api/cma_tokens and run
````
contentful space export --space-id=p2iyhzd1u4a7 --management-token=xxx --download-assets
````
