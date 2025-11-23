---
sidebar_position: 1
---

# Getting Started

Welcome to the **TS Monorepo** documentation! This guide will help you set up the development environment and get started with the monorepo.

:::tip[Help Keep Our Docs Alive! ]

**Found something outdated? Missing a crucial step? Discovered a better approach?**

Our documentation thrives when everyone contributes! Whether you're fixing a typo, adding missing examples, updating deprecated instructions, or sharing hard-won insights from your development experience - **every contribution makes our docs more valuable for everyone**.

**Quick ways to contribute:**

- 🐛 **Fix what's broken** - Update outdated commands, fix broken links, correct errors
- 📝 **Fill the gaps** - Add missing setup steps, environment configs, or troubleshooting tips  
- 💡 **Share your expertise** - Document workflows, best practices, or solutions you've discovered
- 🔄 **Keep it current** - Update version numbers, dependencies, or changed processes

**Ready to help?** Include your improvements in your Pull Requests

:::

## Overview

Take a moment to explain your project here!

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Tools

- **[Node.js](https://nodejs.org/en/download/)** version 20.0 or above
- **[pnpm](https://pnpm.io/installation)** version 10.0 or above
  - Used as the package manager
- **[Git](https://git-scm.com/downloads)**
  - Used for version control
- **[Infisical CLI](https://infisical.com/docs/cli/overview)**
  - Used for secret management

### Mobile Development (Optional)

Only required if working on the mobile app:

- **[Android Studio](https://developer.android.com/studio)** for Android development
- **[Xcode](https://developer.apple.com/xcode/)** for iOS development (macOS only)

### Firebase Tools (Optional)

For backend development:

- **[Firebase CLI](https://firebase.google.com/docs/cli)**: `npm install -g firebase-tools`

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/delvdotcom/ts-monorepo.git
cd ts-monorepo
```

### 2. Install Dependencies

Install all dependencies for the entire monorepo:

```bash
pnpm install
```

This will install dependencies for all apps, services, and packages in the monorepo.

:::warning[Additional Install Required for Mobile]

When working with the mobile app an additional installation step is required:

```bash
cd apps/mobile
pnpm install
```

:::

### 3. Environment Setup

Ensure you have access to the Infisical project - request access otherwise.

```bash
pnpm setup-env:dev
```

### 4. Build Shared Packages

Build the shared packages that other apps depend on:

```bash
pnpm build:packages             # Builds packages as they are
# OR
pnpm watch                      # Continuously re-builds packages as changes are made
```

### 5. Start Development

Choose your development path:

#### Run All Services

```bash
pnpm dev
```

#### Run Specific Applications

```bash
# Web application only
pnpm --filter @repo/web dev

# Mobile application only
pnpm --filter @repo/mobile dev

# API services only
pnpm --filter @repo/api dev
```

## Project Structure

```text
ts-monorepo/
├── apps/
│   ├── mobile/          # React Native/Expo mobile app
│   ├── web/             # Next.js web application
│   └── wiki/            # Documentation (this site)
├── services/
│   ├── api/             # Hono API backend
│   └── fns/             # Auxiliary Firebase Functions
├── packages/
│   ├── common/          # Shared utilities and types
│   ├── core/            # Core business logic (backend)
│   ├── openapi-schema/  # API schema definitions
│   └── ui/              # Shared UI components for web & mobile
└── bin/                 # Utility scripts
```

## Next Steps

Now that you have the basics set up, explore the specific guides for each workspace:

### 🚀 Application Development

- **[Web Development](./Web/getting-started.md)** - Next.js application setup and development
- **[Mobile Development](./Mobile/getting-started.md)** - React Native/Expo app development
- **[API Development](./Api/getting-started.md)** - Backend services and Firebase Functions

### 📦 Shared Resources

- **[Package Development](./Packages/overview.md)** - Working with shared packages
- **[Development Guidelines](./Development/overview.md)** - Coding standards and best practices

### 🔗 Additional Resources

- **[Third-Party Integrations](./Integrations/3rd-party-integrations.md)** - External service integrations
- **[Quick Links](./quicklinks.md)** - Essential URLs and shortcuts
- **[Troubleshooting Guide](./troubleshooting.md)** - Common issues and solutions
- **[Architecture Decisions](./architectural-decisions.md)** - Design decisions and rationale

## Troubleshooting

### Getting Help

- Check the **[Troubleshooting Guide](./troubleshooting)**
- Review workspace-specific documentation
- Contact the development team for environment-specific issues

---

**Ready to dive deeper?** Choose your development focus from the guides above to get started with specific applications and services.
