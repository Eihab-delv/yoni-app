---
sidebar_position: 0
---

# API Development Guide

This guide covers developing the backend API services built with Hono and deployed on Firebase Functions.

## Overview

The API platform consists of:

- **[Hono](https://hono.dev/)** - Fast, lightweight web framework (alternative to Express)
- **[Firebase Functions](https://firebase.google.com/docs/functions)** - Serverless compute platform
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Firestore](https://firebase.google.com/docs/firestore)** - NoSQL database
- **[OpenAPI](https://www.openapis.org/)** - API specification and documentation
- **[Zod](https://github.com/colinhacks/zod)** - Runtime type validation

## Prerequisites

Before starting, ensure you have completed the **[main setup guide](../intro.md)**.

### Additional Requirements

1. **Firebase CLI**

   ```bash
   npm install -g firebase-tools
   ```

2. **Firebase Authentication**

   ```bash
   firebase login
   ```

3. **Firebase Project Access**
   - Contact your team lead for project permissions
   - Verify access: `firebase projects:list`

## Quick Start

### 1. Navigate to API Service

```bash
cd services/api
```

### 2. Environment Setup

The API uses Firebase configuration and environment variables:

```bash
# Set Firebase project
firebase use development  # or production

```

### 3. Start Development Server

```bash
# From the root of the monorepo
pnpm --filter @repo/api dev

# Or from the API service directory
pnpm dev
```

The API will be available at `http://localhost:3001`.

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm deploy` | Deploy to Firebase Functions |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run tests |

## OpenAPI Documentation

The API automatically generates OpenAPI documentation:

### Viewing Documentation

1. Start the development server
2. Visit `http://localhost:3001/v1/openapi`
3. Interactive docs at `http://localhost:3001/v1/docs`

## Related Documentation

- [Web Development Guide](../web/getting-started)
- [Mobile Development Guide](../mobile/getting-started)
- [Package Development](../packages/overview)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Hono Documentation](https://hono.dev/)
