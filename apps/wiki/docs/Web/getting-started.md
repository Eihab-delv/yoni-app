---
sidebar_position: 1
---

# Web Development Guide

This guide covers setting up and developing the Next.js web application (`@repo/web`).

## Overview

The web application is built with:

- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Tanstack React Query](https://tanstack.com/query)** - Data fetching and state management
- **[Firebase](https://firebase.google.com/)** - Authentication & Push Notification Services

## Prerequisites

Before starting, ensure you have completed the **[main setup guide](../intro.md)**.

## Quick Start

### 1. Navigate to Web App

```bash
cd apps/web
```

### 2. Start Development Server

```bash
# From the web app directory
pnpm dev
```

The application will be available at `http://localhost:3000`.

:::tip[Injecting Environment Variables]

Running `pnpm dev` will automatically inject the required envs into the development process provided that you have logged in with infisical. If you are not logged in, the command will fail and prompt you to run `infisical login`.

:::

## Development Workflow

### 1. Using Shared Components

Import UI components from the shared package:

```tsx
import { Button, Card, Input } from '@repo/ui';

export default function MyPage() {
  return (
    <Card>
      <Input placeholder="Enter text" />
      <Button>Submit</Button>
    </Card>
  );
}
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm lint` | Run ESLint |
| `pnpm compile` | Type-check without building |
| `pnpm clean` | Clean build artifacts |
| `pnpm storybook` | |
| `pnpm build-storybook` | |

## Internationalisation

The app supports multiple languages using next-intl:

```tsx
import { useTranslations } from 'next-intl';

export function Welcome() {
  const t = useTranslations('common');
  
  return <h1>{t('welcome')}</h1>;
}
```

## Deployment

Staging & Production deployments are handled automatically through CI/CD when changes are merged to the main branch.

## Related Documentation

- [Mobile Development Guide](../mobile/getting-started)
- [API Development Guide](../api/getting-started)
- [Package Development](../packages/overview)
- [Deployment Guide](../deployment/web)
