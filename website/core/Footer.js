/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

class Footer extends React.Component {
  render() {
    return (
      <>
        <footer className="nav-footer" id="footer">
          <section className="sitemap">
            <div className="footerSection">
              <h5>Foundation</h5>
              <a href="https://www.nervos.org/">
                About Us
              </a>
            </div>
            <div className="footerSection">
              <h5>Developer</h5>
              <a href="https://github.com/nervosnetwork">
                GitHub
              </a>
              <a href="https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0002-ckb/0002-ckb.md">
                Whitepaper
              </a>
              <a href="https://github.com/nervosnetwork/rfcs">
                RFCs
              </a>
            </div>
            <div className="footerSection socialLinks">
              {this.props.config.socialLinks.map((item) => (
                <a href={item.url} className="socialLink" key={item.label}>
                  <img src={`${this.props.config.baseUrl}${item.icon}`} />
                  {item.label}
                </a>
              ))}
            </div>
          </section>
          <section className="copyright">
            {this.props.config.copyright && (
              <span>{this.props.config.copyright}</span>
            )}
          </section>
        </footer>
        <div id="oldSiteLink">
          <div>
            <span>Note we've completely rebuilt Nervos Doc site! </span><span>For the old doc site, please see <a href={this.props.config.oldDocSiteUrl}>docs-old</a>.</span>
          </div>
        </div>
      </>
    );
  }
}

module.exports = Footer;
