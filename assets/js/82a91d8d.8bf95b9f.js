"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[4490],{3905:(e,t,a)=>{a.d(t,{Zo:()=>p,kt:()=>m});var n=a(7294);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function i(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function o(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?i(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):i(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function l(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},i=Object.keys(e);for(n=0;n<i.length;n++)a=i[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)a=i[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var s=n.createContext({}),c=function(e){var t=n.useContext(s),a=t;return e&&(a="function"==typeof e?e(t):o(o({},t),e)),a},p=function(e){var t=c(e.components);return n.createElement(s.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},u=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,i=e.originalType,s=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),u=c(a),m=r,k=u["".concat(s,".").concat(m)]||u[m]||d[m]||i;return a?n.createElement(k,o(o({ref:t},p),{},{components:a})):n.createElement(k,o({ref:t},p))}));function m(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=a.length,o=new Array(i);o[0]=u;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:r,o[1]=l;for(var c=2;c<i;c++)o[c]=a[c];return n.createElement.apply(null,o)}return n.createElement.apply(null,a)}u.displayName="MDXCreateElement"},9989:(e,t,a)=>{a.r(t),a.d(t,{frontMatter:()=>l,contentTitle:()=>s,metadata:()=>c,toc:()=>p,default:()=>u});var n=a(7462),r=a(3366),i=(a(7294),a(3905)),o=["components"],l={id:"introduction-to-ckb-studio",title:"Introduction to CKB Studio"},s=void 0,c={unversionedId:"essays/introduction-to-ckb-studio",id:"essays/introduction-to-ckb-studio",title:"Introduction to CKB Studio",description:"Authored by Phil Li @ Obsidian Labs",source:"@site/docs/essays/introduction-to-ckb-studio.mdx",sourceDirName:"essays",slug:"/essays/introduction-to-ckb-studio",permalink:"/docs/essays/introduction-to-ckb-studio",tags:[],version:"current",lastUpdatedBy:"xying21",lastUpdatedAt:1648618402,formattedLastUpdatedAt:"3/30/2022",frontMatter:{id:"introduction-to-ckb-studio",title:"Introduction to CKB Studio"},sidebar:"Essays",previous:{title:"Script dependencies",permalink:"/docs/essays/dependencies"},next:{title:"Technical Bits on Polyjuice",permalink:"/docs/essays/polyjuice"}},p=[{value:"Installation",id:"installation",children:[{value:"Download",id:"download",children:[],level:3},{value:"Install",id:"install",children:[],level:3}],level:2},{value:"Feature Walkthrough",id:"feature-walkthrough",children:[{value:"Install Dependencies for CKB Development",id:"install-dependencies-for-ckb-development",children:[],level:3},{value:"CKB Script Editor",id:"ckb-script-editor",children:[{value:"Project List",id:"project-list",children:[],level:4},{value:"Compiler",id:"compiler",children:[],level:4},{value:"Debugger",id:"debugger",children:[],level:4}],level:3},{value:"CKB Keypair Manager",id:"ckb-keypair-manager",children:[],level:3},{value:"CKB Node Manager",id:"ckb-node-manager",children:[{value:"Create a Node Instance",id:"create-a-node-instance",children:[],level:4},{value:"Start a CKB Node",id:"start-a-ckb-node",children:[],level:4},{value:"Switch Networks",id:"switch-networks",children:[],level:4}],level:3},{value:"CKB Explorer",id:"ckb-explorer",children:[],level:3},{value:"CKB Transaction Constructor",id:"ckb-transaction-constructor",children:[{value:"Cell Explorer",id:"cell-explorer",children:[],level:4},{value:"Assemble General Transactions Manually",id:"assemble-general-transactions-manually",children:[],level:4},{value:"Generate Transactions of Specific Types",id:"generate-transactions-of-specific-types",children:[],level:4}],level:3}],level:2}],d={toc:p};function u(e){var t=e.components,l=(0,r.Z)(e,o);return(0,i.kt)("wrapper",(0,n.Z)({},d,l,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,(0,i.kt)("em",{parentName:"p"},"Authored by ",(0,i.kt)("a",{parentName:"em",href:"https://github.com/qftgtr"},"Phil Li @ Obsidian Labs"))),(0,i.kt)("h1",{id:"introduction-to-ckb-studio"},"Introduction to CKB Studio"),(0,i.kt)("p",null,(0,i.kt)("img",{src:a(9446).Z})),(0,i.kt)("p",null,"CKB Studio is an IDE to develop CKB scripts on the ",(0,i.kt)("a",{parentName:"p",href:"http://nervos.io/"},"Nervos")," blockchain. It includes"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#ckb-script-editor"},"CKB Script Editor")," - code CKB scripts and use the integrated ",(0,i.kt)("a",{parentName:"li",href:"#compiler"},"compiler")," and ",(0,i.kt)("a",{parentName:"li",href:"#debugger"},"debugger")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#ckb-keypair-manager"},"CKB Keypair Manager")," - create and manage CKB keypairs"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#ckb-node-manager"},"CKB Node Manager")," - run CKB node and miner; switch between local, Aggron testnet and the CKB mainnet"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#ckb-explorer"},"CKB Explorer")," - view account information and transaction history"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#ckb-transaction-constructor"},"CKB Transaction Constructor")," - generate CKB transactions conveniently")),(0,i.kt)("h2",{id:"installation"},"Installation"),(0,i.kt)("h3",{id:"download"},"Download"),(0,i.kt)("p",null,"Installation packages are provided in ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/ObsidianLabs/CKB-Studio/releases"},"releases"),". Please select the appropriate format according to your operating system (",(0,i.kt)("inlineCode",{parentName:"p"},".dmg")," or ",(0,i.kt)("inlineCode",{parentName:"p"},".zip")," for Mac OS, ",(0,i.kt)("inlineCode",{parentName:"p"},".AppImage")," for Linux)."),(0,i.kt)("h3",{id:"install"},"Install"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("strong",{parentName:"li"},"MacOS"),": Double-click to open ",(0,i.kt)("inlineCode",{parentName:"li"},"CKBStudio-x.x.x.dmg")," and drag ",(0,i.kt)("em",{parentName:"li"},"CKB Studio")," into the ",(0,i.kt)("em",{parentName:"li"},"Applications")," folder."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("strong",{parentName:"li"},"Linux"),": Right-click ",(0,i.kt)("inlineCode",{parentName:"li"},"CKBStudio-x.x.x.AppImage"),", select ",(0,i.kt)("em",{parentName:"li"},"Properties")," => ",(0,i.kt)("em",{parentName:"li"},"Permissions")," => ",(0,i.kt)("em",{parentName:"li"},"Execute"),", and check the option ",(0,i.kt)("em",{parentName:"li"},"Allow executing file as progrom"),". Close the property window and double-click the application to open it (different Linux systems may have slightly different installation procedures).")),(0,i.kt)("h2",{id:"feature-walkthrough"},"Feature Walkthrough"),(0,i.kt)("h3",{id:"install-dependencies-for-ckb-development"},"Install Dependencies for CKB Development"),(0,i.kt)("p",null,"When CKB Studio is started for the first time, it will display a welcome page to help you install the dependencies for CKB development - ",(0,i.kt)("em",{parentName:"p"},"Docker"),", ",(0,i.kt)("em",{parentName:"p"},"CKB Node")," and ",(0,i.kt)("em",{parentName:"p"},"CKB Compiler"),"."),(0,i.kt)("p",{align:"center"},(0,i.kt)("img",{src:a(6241).Z,width:"800px"})),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"CKB Studio uses ",(0,i.kt)("a",{parentName:"li",href:"https://www.docker.com/"},"Docker")," to run CKB node and the compiler. If you don't have Docker installed before, click the Install Docker button to open the Docker official website and follow the instructions to download and install."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#ckb-node-manager"},"CKB Node")," is a docker image (",(0,i.kt)("a",{parentName:"li",href:"https://hub.docker.com/r/nervos/ckb"},(0,i.kt)("inlineCode",{parentName:"a"},"nervos/ckb")),") that contains all the necessary softwares and dependencies to start a CKB node. You can install different node versions in the dropdown menu."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"#compiler"},"CKB Compiler")," is a docker image (",(0,i.kt)("a",{parentName:"li",href:"https://hub.docker.com/r/nervos/ckb-riscv-gnu-toolchain"},(0,i.kt)("inlineCode",{parentName:"a"},"nervos/ckb-riscv-gnu-toolchain")),") that contains all the necessary softwares and dependencies to compiel a CKB project. You can install different compiler versions in the dropdown menu.")),(0,i.kt)("h3",{id:"ckb-script-editor"},"CKB Script Editor"),(0,i.kt)("h4",{id:"project-list"},"Project List"),(0,i.kt)("p",null,"The main interface will show a list of CKB projects. If you open CKB Studio for the first time, this list will be empty. You can click the ",(0,i.kt)("em",{parentName:"p"},"New")," button to create a new CKB project. CKB Studio has provided a list of templates to help you get started:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"[JavaScript]"," moleculec-es"),(0,i.kt)("li",{parentName:"ul"},"[JavaScript]"," molecule-javascript"),(0,i.kt)("li",{parentName:"ul"},"[JavaScript]"," minimal"),(0,i.kt)("li",{parentName:"ul"},"[JavaScript]"," HTLC"),(0,i.kt)("li",{parentName:"ul"},"[C]"," carrot"),(0,i.kt)("li",{parentName:"ul"},"[C]"," Simple UDT"),(0,i.kt)("li",{parentName:"ul"},"Duktape")),(0,i.kt)("p",{align:"center"},(0,i.kt)("img",{src:a(6649).Z,width:"800px"})),(0,i.kt)("p",null,"After a project is created, CKB Studio will automatically navigate to the project editor."),(0,i.kt)("h4",{id:"compiler"},"Compiler"),(0,i.kt)("p",null,"Click the ",(0,i.kt)("em",{parentName:"p"},"Build")," button (with the hammer icon) in the project toolbar (above the file tree) to compile the current CKB project. CKB Studio will choose the right compiler to use depending on the project language (JavaScript or C)."),(0,i.kt)("p",{align:"center"},(0,i.kt)("img",{src:a(4127).Z,width:"200px"})),(0,i.kt)("p",null,"There is an extra step before building a JavaScript project. You will need to type the command ",(0,i.kt)("inlineCode",{parentName:"p"},"npm install")," or ",(0,i.kt)("inlineCode",{parentName:"p"},"yarn")," manually in the terminal to install the project dependecies."),(0,i.kt)("p",{align:"center"},(0,i.kt)("img",{src:a(7220).Z,width:"800px"})),(0,i.kt)("p",null,"The compiled files will be at different locations based on the project language:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"build/*")," for JavaScript project"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"{script_name}.o")," for C project")),(0,i.kt)("h4",{id:"debugger"},"Debugger"),(0,i.kt)("p",null,"CKB Studio has integrated the ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/xxuejie/ckb-standalone-debugger"},"CKB debugger"),". Click the ",(0,i.kt)("em",{parentName:"p"},"Debug")," button (with the bug icon) in the project toolbar to debug the current CKB project."),(0,i.kt)("p",{align:"center"},(0,i.kt)("img",{src:a(9654).Z,width:"200px"})),(0,i.kt)("p",null,"The debugger will run the mocked transaction defined in ",(0,i.kt)("inlineCode",{parentName:"p"},"mock/tx.json")," (or the file defined in the project settings). It will help you run the CKB script and check the execution result very easily."),(0,i.kt)("p",{align:"center"},(0,i.kt)("img",{src:a(9770).Z,width:"800px"})),(0,i.kt)("h3",{id:"ckb-keypair-manager"},"CKB Keypair Manager"),(0,i.kt)("p",null,"Click the green button (with the key icon) in the bottom left corner to open the keypair manager. In the keypair manager, you can create, import, and manage CKB keys. Make sure you created some keypairs before creating a CKB node. To initialize a CKB node, you will need a miner address to receive the mining rewards."),(0,i.kt)("p",{align:"center"},(0,i.kt)("img",{src:a(2104).Z,width:"800px"})),(0,i.kt)("p",null,"Please note that all keys in the keypair manager are for development purpose only. The private keys are saved unencrypted so ",(0,i.kt)("strong",{parentName:"p"},"DO NOT")," use them on the mainnet."),(0,i.kt)("h3",{id:"ckb-node-manager"},"CKB Node Manager"),(0,i.kt)("h4",{id:"create-a-node-instance"},"Create a Node Instance"),(0,i.kt)("p",null,"Click the ",(0,i.kt)("em",{parentName:"p"},"Network")," tab in the header to open the CKB network manager, where you can manage instances for CKB nodes and start running a CKB network. If you open CKB Studio for the first time, the instance list will be empty."),(0,i.kt)("p",{align:"center"},(0,i.kt)("img",{src:a(4636).Z,width:"800px"})),(0,i.kt)("p",null,"To create a new CKB node instance, click the ",(0,i.kt)("em",{parentName:"p"},"New Instance")," button. You need to select a ",(0,i.kt)("em",{parentName:"p"},"block assembler")," as the miner so make sure you have created keypairs in the ",(0,i.kt)("a",{parentName:"p",href:"#ckb-keypair-manager"},"Keypair Manager"),"."),(0,i.kt)("p",{align:"center"},(0,i.kt)("img",{src:a(1501).Z,width:"800px"})),(0,i.kt)("h4",{id:"start-a-ckb-node"},"Start a CKB Node"),(0,i.kt)("p",null,"Click the ",(0,i.kt)("em",{parentName:"p"},"Start")," button to start a CKB node. Once the node is started, you can see both the node log and miner log in the terminals below."),(0,i.kt)("p",{align:"center"},(0,i.kt)("img",{src:a(3841).Z,width:"800px"})),(0,i.kt)("h4",{id:"switch-networks"},"Switch Networks"),(0,i.kt)("p",null,"In the ",(0,i.kt)("em",{parentName:"p"},"Network")," dropdown menu you can switch to other networks such as the ",(0,i.kt)("a",{parentName:"p",href:"testnet"},"Aggron testnet")," or the CKB mainnet. Switching the network will stop your curretnly running instance."),(0,i.kt)("p",{align:"center"},(0,i.kt)("img",{src:a(2533).Z,width:"300px"})),(0,i.kt)("h3",{id:"ckb-explorer"},"CKB Explorer"),(0,i.kt)("p",null,"In the ",(0,i.kt)("em",{parentName:"p"},"Explorer")," tab, you can look at basic account information and transaction history."),(0,i.kt)("p",{align:"center"},(0,i.kt)("img",{src:a(4686).Z,width:"800px"})),(0,i.kt)("h3",{id:"ckb-transaction-constructor"},"CKB Transaction Constructor"),(0,i.kt)("p",null,"CKB has a special cell-based structure for its transactions. The ",(0,i.kt)("em",{parentName:"p"},"TX Constructor")," is a dedicated client to facilitate the construction of CKB transactions."),(0,i.kt)("p",{align:"center"},(0,i.kt)("img",{src:a(3345).Z,width:"800px"})),(0,i.kt)("h4",{id:"cell-explorer"},"Cell Explorer"),(0,i.kt)("p",null,"Cells are the fundamental elements to form CKB transactions. The bottom half of the interface is a ",(0,i.kt)("em",{parentName:"p"},"cell explorer")," where you can look through available cells (live cells) for each address. To learn more about CKB cells, please refer to the ",(0,i.kt)("a",{parentName:"p",href:"cell-model"},"cell model"),"."),(0,i.kt)("p",null,"In the cell explorer, you can"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"Check the total number and total capacity of live cells"),(0,i.kt)("li",{parentName:"ul"},"Double-click a cell to look at its detailed information"),(0,i.kt)("li",{parentName:"ul"},"Use the ",(0,i.kt)("em",{parentName:"li"},"show empty cells")," toggler to show/hide ",(0,i.kt)("em",{parentName:"li"},"empty cells")," (cells that do not have data & type script)"),(0,i.kt)("li",{parentName:"ul"},"Drag cells to ",(0,i.kt)("em",{parentName:"li"},"Inputs")," or ",(0,i.kt)("em",{parentName:"li"},"Deps")," to construct transactions"),(0,i.kt)("li",{parentName:"ul"},"Generate CKB transactions for specific types (see ",(0,i.kt)("a",{parentName:"li",href:"#generate-transactions-of-specific-types"},"below"),")")),(0,i.kt)("h4",{id:"assemble-general-transactions-manually"},"Assemble General Transactions Manually"),(0,i.kt)("p",null,"If you want to make a general transaction, you need to assemble the input, output, and dep cells manually using the transaction constructor. You probably need to use some empty cells, so remember to turn on the ",(0,i.kt)("em",{parentName:"p"},"show empty cells")," toggler to display them in the cell explorer. Drag the cells you need to ",(0,i.kt)("em",{parentName:"p"},"Inputs")," and ",(0,i.kt)("em",{parentName:"p"},"Depts"),", and click the ",(0,i.kt)("em",{parentName:"p"},"new")," button next to ",(0,i.kt)("em",{parentName:"p"},"Outputs")," to create output cells."),(0,i.kt)("p",{align:"center"},(0,i.kt)("img",{src:a(3345).Z,width:"800px"})),(0,i.kt)("p",null,"Once the inputs, deps and outputs are set properly, click the ",(0,i.kt)("em",{parentName:"p"},"Push Transaction")," button where you can see the raw transaction object. Select keys you want to use to sign the transaction and click the ",(0,i.kt)("em",{parentName:"p"},"Sign Transaction")," button. CKB Studio will load required private keys to finish the signing, and update the transaction object with witnesses data. Then you can click the ",(0,i.kt)("em",{parentName:"p"},"Push Transaction")," button to submit the transaction, and wait until it is confirmed by the CKB network."),(0,i.kt)("p",{align:"center"},(0,i.kt)("img",{src:a(743).Z,width:"800px"})),(0,i.kt)("h4",{id:"generate-transactions-of-specific-types"},"Generate Transactions of Specific Types"),(0,i.kt)("p",null,"For some specific types of transactions, CKB Studio can help you determine which cells to use and combine them into a transaction. The following types of transactions are supported now"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"Make regular transfer"),(0,i.kt)("li",{parentName:"ul"},"Construct a new cell with custom data"),(0,i.kt)("li",{parentName:"ul"},"Mint ",(0,i.kt)("a",{parentName:"li",href:"https://talk.nervos.org/t/rfc-simple-udt-draft-spec/4333"},"User Defined Token (UDT)")),(0,i.kt)("li",{parentName:"ul"},"Make UDT transfers")),(0,i.kt)("p",null,"For example, click the ",(0,i.kt)("em",{parentName:"p"},"Transfer")," button next to search bar to open the ",(0,i.kt)("em",{parentName:"p"},"Transfer")," window. You can type in the amount and the recipient address, and CKB Studio will look through all available empty cells and generate a transaction that satisfies your entered values. You can also use the same button to transfer a UDT token. Next, following the same procedures as described above to sign the transaction and push it to the running CKB network."),(0,i.kt)("p",{align:"center"},(0,i.kt)("img",{src:a(5861).Z,width:"800px"})))}u.isMDXComponent=!0},4127:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/images/build_button-2a1d4b21f22153b7ce919bf1a6c8e574.png"},1501:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/images/create_node_instance-d1fc076891ecb079b3f59042c41b33b7.png"},6649:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/images/create_project-d57006ecb47494e75465643e0c49f9f3.png"},9654:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/images/debug_button-5b3b7fa683e30c5184cf7d82061dd6ba.png"},9770:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/images/debug_failed-1c2ca831190cb87548e9871c22dd1575.png"},4686:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/images/explorer-b003f4bc0af75ed828e5922436aa034a.png"},2104:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/images/keypair_manager-795977236b17a4c82ff8eaca6a664c21.png"},4636:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/images/node_list_empty-4311ed90c86157a761530d26551e2e0f.png"},743:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/images/sign_transaction-aecc302337c67215d2aa163c5d7fe590.png"},3841:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/images/start_node_instance-9373d96a8ae1fba33ac071f1ab43f9bf.png"},2533:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/images/switch_network-f64dd42f3f87b0c2b086c2cfc066390c.png"},5861:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/images/transfer_transaction-4b4effc32d09216f4cf43e1f5e858c06.png"},3345:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/images/tx_constructor-10badaf4dd7144ad61bf50fc011dc963.png"},6241:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/images/welcome-870fff968f893f0c48e40260778ec32a.png"},7220:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/images/yarn-0faa3cbaaa581950307fee1c84e8b8fd.png"},9446:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/images/main-c1ff4352663753dbad46c8d2b1f271d5.png"}}]);