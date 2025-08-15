---
sidebar_position: 2
---

# Workshop Setup

Before we dive into building with Cube, let's get your environment ready.

## Prerequisites

### Cube Cloud Account

You'll need a Cube Cloud account to complete this workshop. If you don't have one yet, we'll set one up in the next section: [Deployment Setup](./deployment-setup)

### Local Development Environment

For the React application portion, you'll need Node.js installed locally.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

#### Check Node.js Version

<Tabs groupId="operating-systems">
<TabItem value="mac" label="macOS">

```bash
node --version
```

</TabItem>
<TabItem value="windows" label="Windows">

```cmd
node --version
```

</TabItem>
</Tabs>

You should see version 20.x or higher. If you don't have Node.js installed:

<Tabs groupId="operating-systems">
<TabItem value="mac" label="macOS">

**Option 1: Download from nodejs.org**
1. Visit [nodejs.org](https://nodejs.org)
2. Download and install the LTS version

**Option 2: Using Homebrew**
```bash
brew install node
```

</TabItem>
<TabItem value="windows" label="Windows">

**Option 1: Download from nodejs.org**
1. Visit [nodejs.org](https://nodejs.org)  
2. Download and install the LTS version

**Option 2: Using Chocolatey**
```cmd
choco install nodejs
```

</TabItem>
</Tabs>

### Code Editor

Your favorite IDE or text editor should work just fine. 

## Workshop Files

Throughout the workshop, you'll be copying code snippets and downloading starter files. All code examples will be available in this documentation.

:::tip GitHub Repository
Complete code examples and solutions are available at:
`https://github.com/cube-js/cube-workshop/tree/main/static`
:::

## Test Your Setup

Let's verify everything is working:

<Tabs groupId="operating-systems">
<TabItem value="mac" label="macOS">

```bash
# Check Node.js
node --version

# Check npm
npm --version

# Create a test directory
mkdir cube-workshop-test
cd cube-workshop-test

# Initialize a simple project
npm init -y
npm install react

# Clean up
cd ..
rm -rf cube-workshop-test
```

</TabItem>
<TabItem value="windows" label="Windows">

```cmd
# Check Node.js
node --version

# Check npm  
npm --version

# Create a test directory
mkdir cube-workshop-test
cd cube-workshop-test

# Initialize a simple project
npm init -y
npm install react

# Clean up
cd ..
rmdir /s cube-workshop-test
```

</TabItem>
</Tabs>

If all commands run successfully, you're ready to begin! 

## TPCH Dataset Overview

We'll be working with TPC-H data stored in an open PostgreSQL database that represents TPCH's business data:

- **Customer data** - B2B companies purchasing industrial parts
- **Orders** - Purchase orders with dates, priorities, and status
- **Line items** - Individual products within each order
- **Parts** - Industrial components and their specifications
- **Suppliers** - Vendors providing parts to TPCH
- **Nations/Regions** - Geographic data for global operations

This dataset provides realistic e-commerce scenarios perfect for learning analytics concepts.

---

**Next**: Let's start setting up the Cube Deployment [Deployment Setup →](./deployment-setup)
