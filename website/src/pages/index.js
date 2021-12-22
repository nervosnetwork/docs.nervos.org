/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = {
  Container: props => <div {...props}></div>,
  GridBlock: props => <div {...props}></div>,
  MarkdownBlock: props => <div {...props}></div>
};

import Layout from "@theme/Layout";

const MarkdownBlock = CompLibrary.MarkdownBlock;
const Container = CompLibrary.Container;

class Index extends React.Component {
  render() {
    const { config: siteConfig } = this.props;
    const { baseUrl } = siteConfig;

    const Logo = props => (
      <div className="coverLogo">
        <img src={props.img_src} alt="Nervos Logo" />
      </div>
    );

    const ProjectTitle = props => (
      <h2 className="projectTitle">
        {props.title}
      </h2>
    );

    const Card = props => (
      <div id={props.id} className="card">
        <div className="cardHeader">
          <h2>{props.title}</h2>
        </div>
        <div className="cardBody">
          {props.body}
        </div>
        <div className="cardFooter">
          {props.footer}
        </div>
      </div>
    );

    return (
      <div>
        <div className="homeContainer">
          <div className="homeSplashFade">
            <div className="wrapper homeWrapper">
              <Logo img_src={`${baseUrl}img/cover_logo.png`} />
              <div className="projectDescription">
                <ProjectTitle title={siteConfig.title} />
                <MarkdownBlock>
                  Nervos CKB is a public permissionless blockchain and the layer 1 of Nervos.
                </MarkdownBlock>

                <MarkdownBlock>
                  CKB generates trust and extends this trust to upper layers, making Nervos a trust network. It's also the value store of the Nervos network, providing public, secure and censorship-resistant custody services for assets, identities and other common knowledge created in the network. We will also vigorously develop the developer community and aim to offer blockchain developers exciting new capabilities.
                </MarkdownBlock>

                <MarkdownBlock>
                  If you run into an issue on our documentation website you can contact us on [Nervos talk](https://talk.nervos.org/) or [Discord](https://discord.gg/AqGTUE9).
                </MarkdownBlock>
              </div>
            </div>
          </div>
        </div>

        <div className="mainContainer cards">
          <div className="cardRow">
            <Card
              id="getting-started"
              title="Getting Started"
              body={
                <MarkdownBlock>
                  If you are a beginner who just started experimenting with CKB for the first time, [Basics](docs/basics/introduction) will help you get to know CKB, and get the chain running. [Reference](docs/reference/introduction) contains advanced concepts that might also be of interest.
             </MarkdownBlock>
              }
              footer={
                <MarkdownBlock>
                  [![basics](img/doc_basic.png) Basics](docs/basics/introduction)
                  [![reference](img/doc_reference.png) Reference](docs/reference/introduction)
              </MarkdownBlock>
              }
            />

            <Card
              id="wallet-integration"
              title="Exchange & Wallet Integration"
              body={
                <MarkdownBlock>
                  [Integrate](docs/integrate/introduction) section provides first hand experience gained in integrating CKB into existing exchanges and wallets. [Reference](docs/reference/introduction) might also help you learn more about CKB specific behavior.
             </MarkdownBlock>
              }
              footer={
                <MarkdownBlock>
                  [![integrate](img/doc_integrate.png) Integrate](docs/integrate/introduction)
                  [![reference](img/doc_reference.png) Reference](docs/reference/introduction)
              </MarkdownBlock>
              }
            />
          </div>

          <div className="cardRow">
            <Card
              id="building-dapps"
              title="Building Dapps"
              body={
                <MarkdownBlock>
                  If you are developers who want to build dapps on CKB, [Labs](docs/labs/introduction) provides hands-on tutorials which you can follow. [Reference](docs/reference/introduction) also contains explanations for CKB concepts and specific blockchain behaviors.
             </MarkdownBlock>
              }
              footer={
                <MarkdownBlock>
                  [![basics](img/doc_basic.png) Labs](docs/labs/introduction)
                  [![reference](img/doc_reference.png) Reference](docs/reference/introduction)
              </MarkdownBlock>
              }
            />

            <Card
              id="clarification"
              title="Clarification"
              body={
                <MarkdownBlock>
                  As dapp developers, you might need clarifications on specific part from time to time, [Reference](docs/reference/introduction) will be your best friend on this topc.
             </MarkdownBlock>
              }
              footer={
                <MarkdownBlock>
                  [![reference](img/doc_reference.png) Reference](docs/reference/introduction)
              </MarkdownBlock>
              }
            />

            <Card
              id="random-browsing"
              title="Random Browsing"
              body={
                <MarkdownBlock>
                  For users who are just browing to get a glimpse of CKB's design, or developers who want to learn one or two tips, [Essays](docs/essays/introduction) will provide all sorts of articles explaining CKB related topics. [Reference](docs/reference/introduction) might also be of interest since it aims to describe specific constructs in CKB.
             </MarkdownBlock>
              }
              footer={
                <MarkdownBlock>
                  [![essays](img/doc_essay.png) Essays](docs/essays/introduction)
                  [![reference](img/doc_reference.png) Reference](docs/reference/introduction)
              </MarkdownBlock>
              }
            />

          </div>
        </div>
      </div>
    );
  }
}

export default props => <Layout><Index {...props} /></Layout>;
