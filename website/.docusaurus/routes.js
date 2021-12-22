
import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug','3d6'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config','914'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content','c28'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData','3cf'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata','31b'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry','0da'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes','244'),
    exact: true
  },
  {
    path: '/blog/archive',
    component: ComponentCreator('/blog/archive','f4c'),
    exact: true
  },
  {
    path: '/helloReact',
    component: ComponentCreator('/helloReact','1b8'),
    exact: true
  },
  {
    path: '/search',
    component: ComponentCreator('/search','1cd'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs','8e0'),
    routes: [
      {
        path: '/docs/basics/concepts/cell-model',
        component: ComponentCreator('/docs/basics/concepts/cell-model','234'),
        exact: true,
        'sidebar': "docs"
      },
      {
        path: '/docs/basics/concepts/ckb-vm',
        component: ComponentCreator('/docs/basics/concepts/ckb-vm','d13'),
        exact: true,
        'sidebar': "docs"
      },
      {
        path: '/docs/basics/concepts/consensus',
        component: ComponentCreator('/docs/basics/concepts/consensus','2df'),
        exact: true,
        'sidebar': "docs"
      },
      {
        path: '/docs/basics/concepts/economics',
        component: ComponentCreator('/docs/basics/concepts/economics','fb0'),
        exact: true,
        'sidebar': "docs"
      },
      {
        path: '/docs/basics/concepts/nervos-blockchain',
        component: ComponentCreator('/docs/basics/concepts/nervos-blockchain','ddd'),
        exact: true,
        'sidebar': "docs"
      },
      {
        path: '/docs/basics/glossary',
        component: ComponentCreator('/docs/basics/glossary','448'),
        exact: true,
        'sidebar': "docs"
      },
      {
        path: '/docs/basics/guides/ckb-on-windows',
        component: ComponentCreator('/docs/basics/guides/ckb-on-windows','383'),
        exact: true,
        'sidebar': "docs"
      },
      {
        path: '/docs/basics/guides/devchain',
        component: ComponentCreator('/docs/basics/guides/devchain','814'),
        exact: true,
        'sidebar': "docs"
      },
      {
        path: '/docs/basics/guides/get-ckb',
        component: ComponentCreator('/docs/basics/guides/get-ckb','910'),
        exact: true,
        'sidebar': "docs"
      },
      {
        path: '/docs/basics/guides/mainnet',
        component: ComponentCreator('/docs/basics/guides/mainnet','ea2'),
        exact: true,
        'sidebar': "docs"
      },
      {
        path: '/docs/basics/guides/neuron',
        component: ComponentCreator('/docs/basics/guides/neuron','72e'),
        exact: true,
        'sidebar': "docs"
      },
      {
        path: '/docs/basics/guides/run-ckb-with-docker',
        component: ComponentCreator('/docs/basics/guides/run-ckb-with-docker','42b'),
        exact: true,
        'sidebar': "docs"
      },
      {
        path: '/docs/basics/guides/testnet',
        component: ComponentCreator('/docs/basics/guides/testnet','ef0'),
        exact: true,
        'sidebar': "docs"
      },
      {
        path: '/docs/basics/introduction',
        component: ComponentCreator('/docs/basics/introduction','f8f'),
        exact: true,
        'sidebar': "docs"
      },
      {
        path: '/docs/basics/tools',
        component: ComponentCreator('/docs/basics/tools','e96'),
        exact: true,
        'sidebar': "docs"
      },
      {
        path: '/docs/essays/ckb-core-dev',
        component: ComponentCreator('/docs/essays/ckb-core-dev','dff'),
        exact: true,
        'sidebar': "docs"
      },
      {
        path: '/docs/essays/debug',
        component: ComponentCreator('/docs/essays/debug','72d'),
        exact: true,
        'sidebar': "docs"
      },
      {
        path: '/docs/essays/dependencies',
        component: ComponentCreator('/docs/essays/dependencies','00b'),
        exact: true,
        'sidebar': "docs"
      },
      {
        path: '/docs/essays/developer-materials-guide',
        component: ComponentCreator('/docs/essays/developer-materials-guide','9ca'),
        exact: true,
        'sidebar': "docs"
      },
      {
        path: '/docs/essays/faq',
        component: ComponentCreator('/docs/essays/faq','5f5'),
        exact: true,
        'sidebar': "docs"
      },
      {
        path: '/docs/essays/integrity-check',
        component: ComponentCreator('/docs/essays/integrity-check','01f'),
        exact: true,
        'sidebar': "docs"
      },
      {
        path: '/docs/essays/introduction',
        component: ComponentCreator('/docs/essays/introduction','3b3'),
        exact: true,
        'sidebar': "docs"
      },
      {
        path: '/docs/essays/introduction-to-ckb-studio',
        component: ComponentCreator('/docs/essays/introduction-to-ckb-studio','1bc'),
        exact: true,
        'sidebar': "docs"
      },
      {
        path: '/docs/essays/lifecycle',
        component: ComponentCreator('/docs/essays/lifecycle','b29'),
        exact: true,
        'sidebar': "docs"
      },
      {
        path: '/docs/essays/mint-sudt-via-contract',
        component: ComponentCreator('/docs/essays/mint-sudt-via-contract','05d'),
        exact: true,
        'sidebar': "docs"
      },
      {
        path: '/docs/essays/polyjuice',
        component: ComponentCreator('/docs/essays/polyjuice','2a4'),
        exact: true,
        'sidebar': "docs"
      },
      {
        path: '/docs/essays/pprof',
        component: ComponentCreator('/docs/essays/pprof','cb8'),
        exact: true,
        'sidebar': "docs"
      },
      {
        path: '/docs/essays/rfcs',
        component: ComponentCreator('/docs/essays/rfcs','890'),
        exact: true,
        'sidebar': "docs"
      },
      {
        path: '/docs/essays/rules',
        component: ComponentCreator('/docs/essays/rules','6d9'),
        exact: true,
        'sidebar': "docs"
      },
      {
        path: '/docs/essays/rules',
        component: ComponentCreator('/docs/essays/rules','1e5'),
        exact: true,
        'sidebar': "docs"
      },
      {
        path: '/docs/integrate/introduction',
        component: ComponentCreator('/docs/integrate/introduction','a73'),
        exact: true,
        'sidebar': "docs"
      },
      {
        path: '/docs/integrate/qa',
        component: ComponentCreator('/docs/integrate/qa','71a'),
        exact: true,
        'sidebar': "docs"
      },
      {
        path: '/docs/integrate/sdk',
        component: ComponentCreator('/docs/integrate/sdk','d98'),
        exact: true,
        'sidebar': "docs"
      },
      {
        path: '/docs/labs/capsule-dynamic-loading-tutorial',
        component: ComponentCreator('/docs/labs/capsule-dynamic-loading-tutorial','03d'),
        exact: true,
        'sidebar': "docs"
      },
      {
        path: '/docs/labs/introduction',
        component: ComponentCreator('/docs/labs/introduction','d07'),
        exact: true,
        'sidebar': "docs"
      },
      {
        path: '/docs/labs/lumos-nervosdao',
        component: ComponentCreator('/docs/labs/lumos-nervosdao','0fa'),
        exact: true,
        'sidebar': "docs"
      },
      {
        path: '/docs/labs/sudtbycapsule',
        component: ComponentCreator('/docs/labs/sudtbycapsule','dcf'),
        exact: true,
        'sidebar': "docs"
      },
      {
        path: '/docs/reference/cell',
        component: ComponentCreator('/docs/reference/cell','a96'),
        exact: true,
        'sidebar': "docs"
      },
      {
        path: '/docs/reference/introduction',
        component: ComponentCreator('/docs/reference/introduction','ad4'),
        exact: true,
        'sidebar': "docs"
      },
      {
        path: '/docs/reference/rpc',
        component: ComponentCreator('/docs/reference/rpc','dff'),
        exact: true,
        'sidebar': "docs"
      },
      {
        path: '/docs/reference/script',
        component: ComponentCreator('/docs/reference/script','e35'),
        exact: true,
        'sidebar': "docs"
      },
      {
        path: '/docs/reference/transaction',
        component: ComponentCreator('/docs/reference/transaction','79e'),
        exact: true,
        'sidebar': "docs"
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/','deb'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*')
  }
];
