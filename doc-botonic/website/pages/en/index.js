/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

class HomeSplash extends React.Component {
  render() {
    const {siteConfig, language = ''} = this.props;
    const {baseUrl, docsUrl} = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

    const SplashContainer = props => (
      <div className="homeContainer">
        <div className="homeSplashFade">
          <div className="wrapper homeWrapper">{props.children}</div>
        </div>
      </div>
    );

    const Logo = props => (
      <div className="projectLogo">
        <img src={props.img_src} alt="Project Logo" />
      </div>
    );

    const ProjectTitle = props => (
      <h2 className="projectTitle">
        {props.title}
        <small>{props.tagline}</small>
      </h2>
    );

    const PromoSection = props => (
      <div className="section promoSection">
        <div className="promoRow">
          <div className="pluginRowBlock">{props.children}</div>
        </div>
      </div>
    );

    const Button = props => (
      <div className="pluginWrapper buttonWrapper">
        <a className="button" href={props.href} target={props.target}>
          {props.children}
        </a>
      </div>
    );

    return (
      <SplashContainer>
        
        <div className="inner">
          <ProjectTitle tagline={siteConfig.tagline} title={siteConfig.title} />
          <PromoSection>
            <Button href={docUrl('welcome.html')}>User Guide</Button>
            <Button href={docUrl('faq.html')}>FAQ</Button>
          </PromoSection>
        </div>
      </SplashContainer>
    );
  }
}

class Index extends React.Component {
  render() {
    const {config: siteConfig, language = ''} = this.props;
    const {baseUrl} = siteConfig;

    const Block = props => (
      <Container
        padding={['bottom', 'top']}
        id={props.id}
        background={props.background}>
        <GridBlock
          align="center"
          contents={props.children}
          layout={props.layout}
        />
      </Container>
    );

    const FeatureCallout = () => (
      <div
        style={{textAlign: 'center'}}>
      </div>
    );

    const TryOut = () => (
      <Block id="try">
        {[
          {
            content:
              'Botonic is a project created by the Hubtype team. '+
			  'Hubtype is a platform that allows companies to attend their customers on messaging apps by combining bots and humans. '+
			  'The easiest way to put your botonic bot in production is to deploy it to Hubtype, as it offers: '+
'Easy deployments. '+
'Automatic scaling. '+
'Debug tools. '+
'NLU retraining assistance. '+
'1-click integrations including Messaging / Voice channels, Analytics, Helpdesks, NLU as a service. ',
			  
			
            image: `${baseUrl}img/logo.png`,
            imageAlign: 'left',
            title: 'Botonic and Hubtype',
          },
        ]}
      </Block>
    );

    const Description = () => (
      <Block background="dark">
        {[
          { },
        ]}
      </Block>
    );

    const LearnHow = () => (
      <Block background="light">
        {[
          {
            content:
'Botonic is a React-based framework that allows you to build conversational experiences. '+
'A chatbot is an intelligent artificial agent that implies an AI-centric, text-only interaction with your bot. '+
'Botonic helps you to create Conversational App to deliver a good user experience by using all the typical chatbot features like Guided flows, NLU, Multi-language, Media support (images, video, location...), Webviews, Human handoff or Webchat. Your Conversation app will learn fast, understand your need, know you and help for your transactions. '+
'Moreover, to make developer lives easier, Botonic offers: '+
'CLI tools. '+
'A typical development workflow (git, CI, CD, etc). '+
'An open-source and testable code. '+
'A comprehensive documentation. '+
'A welcoming and helpful community. ',
            image: `${baseUrl}img/messageChannels.png`,
            imageAlign: 'right',
            title: 'Chatbot vs Conversational App',
          },
        ]}
      </Block>
    );

    const Features = () => (
      <Block layout="fourColumn">
        {[
          {
          },
        ]}
      </Block>
    );

    const Showcase = () => {
      if ((siteConfig.users || []).length === 0) {
        return null;
      }

      const showcase = siteConfig.users
        .filter(user => user.pinned)
        .map(user => (
          <a href={user.infoLink} key={user.infoLink}>
            <img src={user.image} alt={user.caption} title={user.caption} />
          </a>
        ));

      const pageUrl = page => baseUrl + (language ? `${language}/` : '') + page;

      return (
        <div className="productShowcaseSection paddingBottom">
          <h2>Who is Using This?</h2>
          <p>This project is used by all these people</p>
          <div className="logos">{showcase}</div>
          <div className="more-users">
            <a className="button" href={pageUrl('users.html')}>
              More {siteConfig.title} Users
            </a>
          </div>
        </div>
      );
    };

    return (
      <div>
        <HomeSplash siteConfig={siteConfig} language={language} />
        <div className="mainContainer">
          <Features />
          <FeatureCallout />
          <LearnHow />
          <TryOut />
          <Description />
          <Showcase />
        </div>
      </div>
    );
  }
}

module.exports = Index;
