import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  workshopSidebar: [
    'intro',
    'setup',
    {
      type: 'category',
      label: 'Workshop Exercises',
      items: [
        'data-modeling/index',
        'access-control/index', 
        'caching/index',
        'apis/index',
        'react-app/index',
        'd3-analytics/index',
      ],
    },
    'resources',
  ],
};

export default sidebars;
