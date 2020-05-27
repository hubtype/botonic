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

  return (
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
                        <li key={item.href || item.to} className='footer__item'>
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

            <div
              dangerouslySetInnerHTML={{
                __html: copyright,
              }}
            />
          </div>
        )}
      </div>
    </footer>
  )
}

export default Footer
