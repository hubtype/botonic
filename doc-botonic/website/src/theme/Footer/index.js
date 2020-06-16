/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react'
import classnames from 'classnames'

import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import useBaseUrl from '@docusaurus/useBaseUrl'
import styles from './styles.module.css'
import { WasPageUseful } from './was-page-useful'
import Head from '@docusaurus/Head'

function FooterLink({ to, href, label, prependBaseUrlToHref, ...props }) {
  const toUrl = useBaseUrl(to)
  const normalizedHref = useBaseUrl(href, true)

  return (
    <Link
      className='footer__link-item'
      {...(href
        ? {
            target: '_blank',
            rel: 'noopener noreferrer',
            href: prependBaseUrlToHref ? normalizedHref : href,
          }
        : {
            to: toUrl,
          })}
      {...props}
    >
      {label}
    </Link>
  )
}

const FooterLogo = ({ url, alt }) => (
  <img className='footer__logo' alt={alt} src={url} />
)

function Footer() {
  const context = useDocusaurusContext()
  const { siteConfig = {} } = context
  const { themeConfig = {} } = siteConfig
  const { footer } = themeConfig

  const { copyright, links = [], logo = {} } = footer || {}
  const logoUrl = useBaseUrl(logo.src)

  if (!footer) {
    return null
  }

  const segmentSnippet = () => {
    const SEGMENT_DOCS_API_KEY = process.env.SEGMENT_DOCS_API_KEY // TODO: ATM is necessary to replace it manually, not working after trying: https://www.npmjs.com/package/docusaurus2-dotenv, failing on build
    return `!function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware"];analytics.factory=function(e){return function(){var t=Array.prototype.slice.call(arguments);t.unshift(e);analytics.push(t);return analytics}};for(var e=0;e<analytics.methods.length;e++){var t=analytics.methods[e];analytics[t]=analytics.factory(t)}analytics.load=function(e,t){var n=document.createElement("script");n.type="text/javascript";n.async=!0;n.src="https://cdn.segment.com/analytics.js/v1/"+e+"/analytics.min.js";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(n,a);analytics._loadOptions=t};analytics.SNIPPET_VERSION="4.1.0";analytics.load("${SEGMENT_DOCS_API_KEY}");analytics.page();}}();`
  }

  return (
    <>
      <Head>
        <script type='text/javascript'>{segmentSnippet()}</script>
      </Head>
      <WasPageUseful />
      <footer
        className={classnames('footer', {
          'footer--dark': footer.style === 'dark',
        })}
      >
        <div className='container'>
          {links && links.length > 0 && (
            <div className='row footer__links'>
              {links.map((linkItem, i) => (
                <div key={i} className='col footer__col'>
                  {linkItem.title != null ? (
                    <h4 className='footer__title'>{linkItem.title}</h4>
                  ) : null}
                  {linkItem.items != null &&
                  Array.isArray(linkItem.items) &&
                  linkItem.items.length > 0 ? (
                    <ul className='footer__items'>
                      {linkItem.items.map((item, key) =>
                        item.html ? (
                          <li
                            key={key}
                            className='footer__item'
                            dangerouslySetInnerHTML={{
                              __html: item.html,
                            }}
                          />
                        ) : (
                          <li
                            key={item.href || item.to}
                            className='footer__item'
                          >
                            <FooterLink {...item} />
                          </li>
                        )
                      )}
                    </ul>
                  ) : null}
                </div>
              ))}
            </div>
          )}
          {(logo || copyright) && (
            <div className='text--center'>
              {logo && logo.src && (
                <div className='margin-bottom--sm'>
                  {logo.href ? (
                    <a
                      href={logo.href}
                      target='_blank'
                      rel='noopener noreferrer'
                      className={styles.footerLogoLink}
                    >
                      <FooterLogo alt={logo.alt} url={logoUrl} />
                    </a>
                  ) : (
                    <FooterLogo alt={logo.alt} url={logoUrl} />
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </footer>
    </>
  )
}

export default Footer
