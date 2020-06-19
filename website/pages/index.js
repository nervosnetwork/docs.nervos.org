/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../core/CompLibrary.js');

const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

class Index extends React.Component {
  render() {
    const {config: siteConfig, language = ''} = this.props;
    const {baseUrl} = siteConfig;

    const Logo = props => (
      <div className="projectLogo">
        <img src={props.img_src} alt="Project Logo" />
      </div>
    );

    const ProjectTitle = props => (
      <h2 className="projectTitle">
        {props.title}
      </h2>
    );

    const Card = props => (
      <Container
        padding={['bottom', 'top']}
        id={props.id}
        background={props.background}>
        <div className="cardHeader">
          <h2>{props.title}</h2>
        </div>
        <div className="cardBody">
          {props.body}
        </div>
        <div className="cardFooter">
          {props.footer}
        </div>
      </Container>
    );

    return (
      <div>
        <div className="homeContainer">
          <div className="homeSplashFade">
            <div className="wrapper homeWrapper">
              <Logo img_src={`${baseUrl}img/undraw_monitor.svg`} />
              <div className="inner">
                <ProjectTitle title={siteConfig.title} />
              </div>
              <MarkdownBlock>
                Nervos CKB is a public permissionless blockchain and the layer 1 of Nervos.

                CKB generates trust and extends this trust to upper layers, making Nervos a trust network. It's also the value store of the Nervos network, providing public, secure and censorship-resistant custody services for assets, identities and other common knowledge created in the network. We will also vigorously develop the developer community and aim to offer blockchain developers exciting new capabilities.

                If you run into an issue on our documentation website you can contact us on [Nervos talk](https://talk.nervos.org/) or [Discord](https://discord.gg/AqGTUE9).

              </MarkdownBlock>
              <div>
              </div>
            </div>
          </div>
        </div>

        <div className="mainContainer">
          <Card
           title="Getting Started"
           body={
             <MarkdownBlock>
               If you are a beginner who just started experimenting with CKB for the first time, Basics will help you get to know CKB, and get the chain running. Reference contains advanced concepts that might also be of interest.
             </MarkdownBlock>
           }
           footer={
             <MarkdownBlock>
             </MarkdownBlock>
           }
         />

          <Card
           title="Exchange & Wallet Integrationd"
           body={
             <MarkdownBlock>
               Integrate section provides first hand experience gained in integrating CKB into existing exchanges and wallets. Reference might also help you learn more about CKB specific behavior.
             </MarkdownBlock>
           }
           footer={
             <MarkdownBlock>
             </MarkdownBlock>
           }
         />

          <Card
           title="Building Dapps"
           body={
             <MarkdownBlock>
               If you are developers who want to build dapps on CKB, Labs provides hands-on tutorials which you can follow. Reference also contains explanations for CKB concepts and specific blockchain behaviors.
             </MarkdownBlock>
           }
           footer={
             <MarkdownBlock>
             </MarkdownBlock>
           }
         />

          <Card
           title="Clarification"
           body={
             <MarkdownBlock>
               As dapp developers, you might need clarifications on specific part from time to time, Reference will be your best friend on this topc.
             </MarkdownBlock>
           }
           footer={
             <MarkdownBlock>
             </MarkdownBlock>
           }
         />

          <Card
           title="Random Browsing"
           body={
             <MarkdownBlock>
               For users who are just browing to get a glimpse of CKB's design, or developers who want to learn one or two tips, Essays will provide all sorts of articles explaining CKB related topics. Reference might also be of interest since it aims to describe specific constructs in CKB.
             </MarkdownBlock>
           }
           footer={
             <MarkdownBlock>
             </MarkdownBlock>
           }
         />
        </div>
      </div>
    );
  }
}

module.exports = Index;
