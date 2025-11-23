---
sidebar_position: 3
---

# Environment Variables in Expo

This guide explains how to manage environment variables in your Expo
application, covering both EAS builds and development client builds.

## Overview

Environment variables in Expo applications can be configured in two ways:

1. Through the `eas.json` configuration file
2. Using `.env` files

The method used depends on your build type and configuration.

:::info
If you haven't set up your development environment yet, make sure to follow the
[Getting Started](../intro.md) guide first, particularly the Env
Management section.
:::

## Build Types and Environment Variables

### EAS Builds

When building your application using EAS (e.g., `eas build`), the environment
variables are pulled from your `eas.json` configuration file. These variables
are defined under the `env` key for each build profile.

#### Example Configuration

```json
{
  "build": {
    "production": {
      "env": {
        "ENVIRONMENT": "prod",
        "EXPO_PUBLIC_APPLE_MERCHANT": "merchant.com.app.example",
        "EXPO_PUBLIC_RELEASE_TYPE": "prod"
      }
    },
    "staging": {
      "env": {
        "ENVIRONMENT": "staging",
        "EXPO_PUBLIC_APPLE_MERCHANT": "merchant.com.app.example",
        "EXPO_PUBLIC_RELEASE_TYPE": "staging"
      }
    }
  }
}
```

### Development Client Builds

For builds with `developmentClient: true` enabled, the environment variables are
loaded from `.env` files rather than the `eas.json`
configuration.

:::caution
When using the development client, environment variables defined in `eas.json`
will be ignored in favor of `.env` files.
:::

#### Environment Files Priority

The `.env` files are loaded in the following order of
priority (highest to lowest):

1. `.env.development.local`
2. `.env.development`
3. `.env.local`
4. `.env`

Variables defined in files higher in the list will override those defined in
files lower in the list.

#### Example Development Client Configuration

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "env": {
        // These environment variables will NOT be used
        // when running the development client
      }
    }
  }
}
```

## Best Practices

### Naming Convention

:::important
Always prefix your public environment variables with `EXPO_PUBLIC_`. Only
variables with this prefix will be available in your JavaScript code.
:::

### Security

:::warning
Never commit sensitive environment variables to version control. Add `.env*`
files to your `.gitignore`.
:::

## Usage in Code

```javascript
// Accessing environment variables in your app
const apiKey = process.env.EXPO_PUBLIC_API_KEY;
const environment = process.env.EXPO_PUBLIC_ENVIRONMENT;
```

## Troubleshooting

If your environment variables aren't loading correctly:

1. Verify build profile configuration:

   ```bash
   eas build:configure
   ```

2. Check environment files:

   ```bash
   ls -la .env*
   ```

3. Verify variable naming:

   ```javascript
   console.log(process.env); // Check available variables
   ```

:::tip
If you're using Infisical for environment management, ensure you see the
"Injecting secrets" message in your console output when starting the development
server.
:::
