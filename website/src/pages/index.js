/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Layout from "@theme/Layout";

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
                <p>
                  Nervos CKB is a public permissionless blockchain and the layer 1 of Nervos.
                </p>

                <p>
                  CKB generates trust and extends this trust to upper layers, making Nervos a trust network. It's also the value store of the Nervos network, providing public, secure and censorship-resistant custody services for assets, identities and other common knowledge created in the network. We will also vigorously develop the developer community and aim to offer blockchain developers exciting new capabilities.
                </p>

                <p>
                    If you run into an issue on our documentation website you can contact us on <a href="https://talk.nervos.org/">Nervos talk</a> or <a href="https://discord.gg/AqGTUE9">Discord</a>.
                </p>
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
                  <p>If you are a beginner who just started experimenting with CKB for the first time, <a href="docs/basics/introduction">Basics</a> will help you get to know CKB, and get the chain running. <a href="docs/reference/introduction">Reference</a> contains advanced concepts that might also be of interest.</p>
              }
              footer={
                  <p><a href="docs/basics/introduction"><img src="img/doc_basic.png" alt="basics"/> Basics</a>
                      <a href="docs/reference/introduction"><img src="img/doc_reference.png" alt="reference"/> Reference</a></p>
                  }
            />

            <Card
              id="wallet-integration"
              title="Exchange & Wallet Integration"
              body={
                  <p><a href="docs/integrate/introduction">Integrate</a> section provides first hand experience gained in integrating CKB into existing exchanges and wallets. <a href="docs/reference/introduction">Reference</a> might also help you learn more about CKB specific behavior.</p>
              }
              footer={
                  <p><a href="docs/integrate/introduction"><img src="img/doc_integrate.png" alt="integrate"/> Integrate</a>
                      <a href="docs/reference/introduction"><img src="img/doc_reference.png" alt="reference"/> Reference</a></p>

                  }
            />
          </div>

          <div className="cardRow">
            <Card
              id="building-dapps"
              title="Building Dapps"
              body={
                  <p>If you are developers who want to build dapps on CKB, <a href="docs/labs/introduction">Labs</a> provides hands-on tutorials which you can follow. <a href="docs/reference/introduction">Reference</a> also contains explanations for CKB concepts and specific blockchain behaviors.</p>
              }
              footer={
                  <p><a href="docs/labs/introduction"><img src="img/doc_basic.png" alt="basics" /> Labs</a>
                      <a href="docs/reference/introduction"><img src="img/doc_reference.png" alt="reference" /> Reference</a></p>

                  }
            />

            <Card
              id="clarification"
              title="Clarification"
              body={
                  <p>As dapp developers, you might need clarifications on specific part from time to time, <a href="docs/reference/introduction">Reference</a> will be your best friend on this topc.</p>
              }
              footer={
                  <p><a href="docs/reference/introduction"><img src="img/doc_reference.png" alt="reference"/> Reference</a></p>
                  }
            />

            <Card
              id="random-browsing"
              title="Random Browsing"
              body={
                  <p>For users who are just browing to get a glimpse of CKB&#39;s design, or developers who want to learn one or two tips, <a href="docs/essays/introduction">Essays</a> will provide all sorts of articles explaining CKB related topics. <a href="docs/reference/introduction">Reference</a> might also be of interest since it aims to describe specific constructs in CKB.</p>
              }
              footer={
                <p>
                    <a href="docs/essays/introduction"><img src="img/doc_essay.png" alt="essays" />Essays</a>
                    <a href="docs/reference/introduction"><img src="img/doc_reference.png" alt="reference" />Reference</a>
                </p>
              }
            />

          </div>
        </div>
      </div>
    );
  }
}

export default props => <Layout><Index {...props} /></Layout>;
