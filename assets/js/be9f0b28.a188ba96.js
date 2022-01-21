"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[8793],{3905:(e,t,n)=>{n.d(t,{Zo:()=>h,kt:()=>p});var o=n(7294);function s(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){s(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,o,s=function(e,t){if(null==e)return{};var n,o,s={},r=Object.keys(e);for(o=0;o<r.length;o++)n=r[o],t.indexOf(n)>=0||(s[n]=e[n]);return s}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(o=0;o<r.length;o++)n=r[o],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(s[n]=e[n])}return s}var c=o.createContext({}),l=function(e){var t=o.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},h=function(e){var t=l(e.components);return o.createElement(c.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},d=o.forwardRef((function(e,t){var n=e.components,s=e.mdxType,r=e.originalType,c=e.parentName,h=i(e,["components","mdxType","originalType","parentName"]),d=l(n),p=s,m=d["".concat(c,".").concat(p)]||d[p]||u[p]||r;return n?o.createElement(m,a(a({ref:t},h),{},{components:n})):o.createElement(m,a({ref:t},h))}));function p(e,t){var n=arguments,s=t&&t.mdxType;if("string"==typeof e||s){var r=n.length,a=new Array(r);a[0]=d;var i={};for(var c in t)hasOwnProperty.call(t,c)&&(i[c]=t[c]);i.originalType=e,i.mdxType="string"==typeof e?e:s,a[1]=i;for(var l=2;l<r;l++)a[l]=n[l];return o.createElement.apply(null,a)}return o.createElement.apply(null,n)}d.displayName="MDXCreateElement"},1359:(e,t,n)=>{n.r(t),n.d(t,{frontMatter:()=>l,contentTitle:()=>h,metadata:()=>u,toc:()=>d,default:()=>m});var o=n(7462),s=n(3366),r=(n(7294),n(3905)),a=n(4996),i=n(9960),c=["components"],l={id:"general",title:"General FAQ"},h=void 0,u={unversionedId:"basics/faq/general",id:"basics/faq/general",title:"General FAQ",description:"Q: Which consensus does Nervos use?",source:"@site/docs/basics/faq/general.md",sourceDirName:"basics/faq",slug:"/basics/faq/general",permalink:"/docs/basics/faq/general",tags:[],version:"current",lastUpdatedBy:"xy2101",lastUpdatedAt:1642746270,formattedLastUpdatedAt:"1/21/2022",frontMatter:{id:"general",title:"General FAQ"},sidebar:"Basics",previous:{title:"Glossary",permalink:"/docs/basics/glossary"},next:{title:"CKB Address",permalink:"/docs/basics/faq/address"}},d=[{value:"<strong>Q</strong>: Which consensus does Nervos use?",id:"q-which-consensus-does-nervos-use",children:[],level:3},{value:"<strong>Q</strong>: What is CKByte?",id:"q-what-is-ckbyte",children:[],level:3},{value:"<strong>Q</strong>: What is SUDT?",id:"q-what-is-sudt",children:[],level:3}],p={toc:d};function m(e){var t=e.components,n=(0,s.Z)(e,c);return(0,r.kt)("wrapper",(0,o.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h3",{id:"q-which-consensus-does-nervos-use"},(0,r.kt)("strong",{parentName:"h3"},"Q"),": Which consensus does Nervos use?"),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"A"),": Consensus refers to the consistent state of distributed network participants, in other words, the historical data and current ledger state of the blockchain that the nodes on the network agree on unanimously. The ledger state consists of records of user accounts and asset balances, such as the number of CKBytes and tokens they own. The consensus algorithm Nervos is using is called NC-MAX. NC-MAX is based on Proof of Work (PoW) and Nakamoto consensus (used by Bitcoin) and is an ambitious project as much as Nervos. It is a consensus solution with zero compromise in terms of security and decentralization, while maximizing the use of network bandwidth. After thoughtful considerations, Nervos believed Proof of Work (PoW) is the best solution."),(0,r.kt)("p",null,"Proof of Stake (PoS) is one of PoW's competitors. One advantage that PoS has is that it requires less power to operate. Compared with PoS, PoW has the following incomparable advantages: 1) PoW mining is affected by external changes in technology, energy production and regulation. This means that PoW is energy efficiency. Moreover, the continuous reinvestment is necessary to maintain a leading position in the competition, which makes long-term monopoly difficult. 2) PoW will not bring monopolistic advantages to early participants in the system. In PoS, rewards are obtained with complete in-protocol resource and determinism, which means that early participants have advantages over latecomers. 3) PoW is simpler and requires far fewer assumptions, therefore, the probability of a security breach is much lower. To achieve the same level of security, PoW is more efficient than PoS except it exhibits security budget in a more explicit way. 4\uff09"),(0,r.kt)("p",null,"Based on the Satoshi Nakamoto consensus of Bitcoin, NC-MAX significantly increases the transaction volume per second and reduces the confirmation time without affecting security or decentralization. Compared with Ethereum, Nervos currently provides 10 times the throughput growth, which is expected to increase exponentially with the development of Layer 2 solutions."),(0,r.kt)("p",null,"Read more information: https://",(0,r.kt)("a",{parentName:"p",href:"http://docs.nervos.org/docs/basics/concepts/consensus"},"docs.nervos.org/docs/basics/concepts/consensus"),"."),(0,r.kt)("p",null,"More discussions on POS and POW: ",(0,r.kt)("a",{parentName:"p",href:"https://talk.nervos.org/t/pow-pos-discussion-in-history/5457"},"https://talk.nervos.org/t/pow-pos-discussion-in-history/5457"),"."),(0,r.kt)("hr",null),(0,r.kt)("h3",{id:"q-what-is-ckbyte"},(0,r.kt)("strong",{parentName:"h3"},"Q"),": What is CKByte?"),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"A"),": CKByte is the token required for the use of the basic functions of the Nervos network. CKByte is the native token of the Nervos CKB blockchain, which can be redeemed for transaction fees, and is also a unit of CKB on-chain space. Possessing 1 CKByte means having 1 byte of storage capacity on CKB, i.e. ownership of 1 byte of a common knowledge base. Instead of cloud servers or general distributed storage, data stored in Common Knowledge Base has a higher value density as the data will be verified by permissionless global consensus and smart contracts throughout the network before being stored on countless nodes in the distributed network. Either the fungible token or non-fungible token, for example, is typical of data held in the common knowledge base."),(0,r.kt)("p",null,"The initial amount of CKByte in design is 33.6 billion, of which 25%, or 8.4 billion CKBytes were reserved for Satoshi Nakamoto (using his/her/their address found in Bitcoin genesis block). However, the \u201ctribute to Satoshi\u201c was later cancelled due to security concerns, and the 8.4 billion CKBytes are sent to ",(0,r.kt)("a",{parentName:"p",href:"https://explorer.nervos.org/address/ckb1qgqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqchfq7c4e0e864p98x0t7mc0k58thz83s97znnd"},"an all-zero address")," in the genesis block, making them effectively \u201cburnt\u201d and will never enter circulation. The real initial amount of CKByte in genesis is thus 25.2 billion."),(0,r.kt)("p",null,"Burning is not the same as not-issued, as these 8.4 billion CKBytes will impact the second issuance. 15% of the 8.4 billion CKBytes will be filled with data (make them occupied capacity), while the remaining 10% of the 8.4 billion CKbytes will be left empty (free capacity). By this setting, miners are guaranteed 15% of secondary issuance, which is effectively the minimal security budget of Nervos, solves perhaps the only unsolved problem in Bitcoin. The 10% empty capacity means at minimum 10% of secondary issuance is \u201cburnt\u201d until Nervos Treasury is enabled. (note: the description of \u201cburnt\u201d 8.4 billion\u2019s impact on secondary issuance ",(0,r.kt)("a",{parentName:"p",href:"https://talk.nervos.org/t/nervos-ckbyte-distribution-and-why-we-are-burning-25-in-the-genesis-block/3503"},"in this article")," is correct, but the 8.4 billion is sent to all-zero address, not Satoshi\u2019s address)."),(0,r.kt)("p",null,"In addition to the CKBytes generated in the Genesis block, a primary issuance of 33.6 billion CKBytes and a secondary issue of 13.44 billion CKBytes per year are set in the protocol. Similar to the Bitcoin mining process, miners are compensated in CKBytes as they provide computing resources to process transactions and secure the network. The primary issuance halves every four years, while the secondary issuance is constant every year. In the beginning, miners will be rewarded by both primary and secondary issuance. After all the 33.6 billion primary issuance has been released, there will only be a secondary issue of 1.344B CKBytes per year. The secondary issue can be seen as payment-by-inflation from CKB users to use the common knowledge base."),(0,r.kt)("p",null,"The secondary issuance is shared by miners, the Nervos DAO and the future Nervos treasury based on common knowledge base usage. CKB can be utilised as a secure store of value, just like BTC. It\u2019s also the fuel of smart contracts and decentralised applications, like ETH, for transaction processing and on-chain storage. The unique crypto-economic of CKByte ensures secure storage of value, value capture of the layered Nervos network, and incentive compatibility of users, miners, developers and node operators."),(0,r.kt)("p",null,"More information is available at:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://www.nervos.org/token"},"Token | Nervos Network")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0015-ckb-cryptoeconomics/0015-ckb-cryptoeconomics.md"},"RFC0015: Crypto-Economics of the Nervos Common Knowledge Base")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://talk.nervos.org/t/the-ckbyte-issuance-model-of-nervos/5321"},"The CKByte Issuance Model of Nervos"))),(0,r.kt)("hr",null),(0,r.kt)("h3",{id:"q-what-is-sudt"},(0,r.kt)("strong",{parentName:"h3"},"Q"),": What is SUDT?"),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"A"),": SUDT is the abbreviation of Simple User Defined Token, which is equivalent to the ERC20 standard on Ethereum. It defines an easy-to-understand token standard, which contains the content that DApp developers need while minting their own tokens on Nervos CKB. You can check ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0025-simple-udt/0025-simple-udt.md"},"SUDT RFC")," for more details. For the method of writing and mining SUDT, please refer to the following documents:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)(i.Z,{to:(0,a.Z)("/docs/labs/sudtbycapsule"),mdxType:"Link"},"Write an SUDT script by Capsule")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)(i.Z,{to:(0,a.Z)("/docs/essays/mint-sudt-via-contract"),mdxType:"Link"},"Mint SUDT via Contract"))),(0,r.kt)("hr",null))}m.isMDXComponent=!0}}]);