---
title: Getting Started with Development
description: Set up your local development environment for contributing to Backlog.rip
---

# Getting Started with Development

This guide will help you set up a local development environment for contributing to Backlog.rip.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (v18 or later)
- **npm** (v8 or later)
- **Git**

## Clone the Repository

First, clone the repository from GitHub:

```bash
git clone https://github.com/gsabater/backlog.rip.git
cd backlog.rip
```

## Install Dependencies

Install the project dependencies:

```bash
npm install
```

## Configuration

Create a `.env` file in the root directory with the following variables:

```
# API Keys
STEAM_API_KEY=your_steam_api_key
IGDB_CLIENT_ID=your_igdb_client_id
IGDB_CLIENT_SECRET=your_igdb_client_secret

# Database
DATABASE_URL=your_database_url
```

## Run the Development Server

Start the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Building for Production

To build the application for production:

```bash
npm run build
```

## Running Tests

To run the test suite:

```bash
npm test
```

## Getting Help

If you need help, you can:

- Join our [Discord community](https://discord.gg/F2sPE5B)
- Open an issue on [GitHub](https://github.com/gsabater/backlog.rip/issues)
- Check our [Developer Documentation](/docs/developer)
