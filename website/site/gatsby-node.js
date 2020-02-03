const path = require(`path`)

exports.onCreateWebpackConfig = ({ actions, loaders, getConfig, stage }) => {
  const config = getConfig()
  console.log(stage)
  if (stage === 'build-html') {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /@rehooks\/local-storage/, // how should i match the module on here??
            use: loaders.null()
          }
        ]
      }
    })
  }

  delete config.resolve.alias['core-js']
  config.resolve.modules = [
    path.resolve(__dirname, 'node_modules/gatsby/node_modules'), // for Gatsby's core-js@2
    'node_modules' // your modules w/ core-js@3
  ]
  /*config.resolve.modules = [
    path.resolve(__dirname, '../../node_modules/gatsby/node_modules'),
    path.resolve(__dirname, './node_modules'),
    'node_modules'
  ]*/
  //delete config.resolve.alias['core-js']
  /*const coreJs2config = config.resolve.alias['core-js']
  delete config.resolve.alias['core-js']
  config.resolve.alias[`core-js/modules`] = `${coreJs2config}/modules`
  try {
    config.resolve.alias[`core-js/es`] = path.dirname(
      require.resolve('core-js/es')
    )
  } catch (err) {}*/
  /*config.resolve.alias['core-js/modules/es.array.filter'] = path.resolve(
    __dirname,
    'node_modules/simplebar/node_modules/core-js/modules/es.array.filter'
  )
  config.resolve.modules = [
    'node_modules', // your modules w/ core-js@3
    path.resolve(__dirname, 'node_modules/gatsby/node_modules') // for Gatsby's core-js@2
  ]*/
  config.module.rules = [
    // Omit the default rule where test === '\.jsx?$'
    ...config.module.rules.filter(
      rule => String(rule.test) !== String(/\.jsx?$/)
    ),
    // Recreate it with custom exclude filter
    {
      // Called without any arguments, `loaders.js` will return an
      // object like:
      // {
      //   options: undefined,
      //   loader: '/path/to/node_modules/gatsby/dist/utils/babel-loader.js',
      // }
      // Unless you're replacing Babel with a different transpiler, you probably
      // want this so that Gatsby will apply its required Babel
      // presets/plugins.  This will also merge in your configuration from
      // `babel.config.js`.
      ...loaders.js(),
      test: /\.jsx?$/,
      // Exclude all node_modules from transpilation, except for '@botonic'
      exclude: modulePath =>
        /node_modules/.test(modulePath) &&
        !/node_modules\/(@botonic)/.test(modulePath)
    },
    {
      test: /\.(scss)$/,
      use: ['style-loader', 'css-loader', 'sass-loader']
    }
    /*{
      test: /(@rehooks\/local-storage|typing-indicator.jsx|emoji-picker-react)/,
      use: loaders.null()
    }*/
    /*{
      test: /(@botonic\/react)/,
      use: loaders.null()
    }*/
  ]
  // This will completely replace the webpack config with the modified object.
  actions.replaceWebpackConfig(config)
}

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions
  const blogPostTemplate = path.resolve(`src/templates/blogTemplate.js`)
  const result = await graphql(`
    {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 1000
      ) {
        edges {
          node {
            frontmatter {
              path
            }
          }
        }
      }
    }
  `)
  // Handle errors
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }
  // ...
  // Create blog-list pages
  const posts = result.data.allMarkdownRemark.edges
  const postsPerPage = 10
  const numPages = Math.ceil(posts.length / postsPerPage)
  Array.from({ length: numPages }).forEach((_, i) => {
    createPage({
      path: i === 0 ? `/blog` : `/blog/page/${i + 1}`,
      component: path.resolve('./src/components/blog/blogPosts.js'),
      context: {
        limit: postsPerPage,
        skip: i * postsPerPage,
        numPages,
        currentPage: i + 1,
        absolutePath: i === 0 ? `/blog` : `/blog/page/${i + 1}`
      }
    })
  })
  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    createPage({
      path: node.frontmatter.path,
      component: blogPostTemplate,
      context: {} // additional data can be passed via context
    })
  })
}
