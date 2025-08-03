import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'WDC 2025 Cube Semantic Layer Workshop',
  tagline: 'Build a universal semantic layer on AWS for AI, BI and data applications featuring Cube Cloud',
  favicon: 'img/cube-icon.svg',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://cube-js.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/cube-workshop/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'cube-js', // Usually your GitHub org/user name.
  projectName: 'cube-workshop', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Remove edit this page links for workshop
          editUrl: undefined,
        },
        blog: false, // Disable blog for workshop
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themes: ['@docusaurus/theme-mermaid'],

  // Enable Mermaid for markdown code blocks
  markdown: {
    mermaid: true,
  },

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'WDC 2025 Cube Semantic Layer Workshop',
      logo: {
        alt: 'Cube Logo',
        src: 'img/cube-logo.svg',
        srcDark: 'img/cube-logo-dark.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'workshopSidebar',
          position: 'left',
          label: 'Workshop',
        },
        {
          href: 'https://github.com/cube-js/cube-workshop',
          label: 'GitHub',
          position: 'right',
        },
        {
          href: 'https://cube.dev',
          label: 'Cube.dev',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Workshop',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/intro',
            },
          ],
        },
        {
          title: 'Cube Community',
          items: [
            {
              label: 'Documentation',
              href: 'https://cube.dev/docs',
            },
            {
              label: 'Slack',
              href: 'https://slack.cube.dev/',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/cube-js/cube',
            },
          ],
        },
        {
          title: 'Resources',
          items: [
            {
              label: 'Cube.dev',
              href: 'https://cube.dev',
            },
            {
              label: 'Blog',
              href: 'https://cube.dev/blog',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Cube Dev, Inc. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
