---
sidebar_position: 1
---

# Mobile Development Guide

This guide covers setting up and developing the React Native mobile application using Expo.

## Overview

The mobile application is built with:

- **[React Native](https://reactnative.dev/)** - Cross-platform mobile development
- **[Expo](https://expo.dev/)** - Development platform and tools
- **[Expo Router](https://docs.expo.dev/router/introduction/)** - File-based navigation
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tanstack React Query](https://tanstack.com/query)** - Data fetching and state management
- **[Firebase](https://firebase.google.com/)** - Authentication + Push Notification Services
- **[EAS](https://docs.expo.dev/eas/)** - Build and deployment services

## Prerequisites

Before starting, ensure you have completed the **[main setup guide](../intro.md)**.

### Mobile Development Setup

#### Development Environment

Choose your preferred development setup:

##### Option 1: Expo Go (Quickest)

- Install [Expo Go](https://expo.dev/go) on your iOS/Android device
- Scan QR codes to run the app instantly

##### Option 2: Development Build (Recommended)

- Install Android Studio or Xcode
- Create custom development builds with native dependencies

##### Option 3: iOS Simulator / Android Emulator

- **iOS**: Requires macOS and Xcode
- **Android**: Requires Android Studio and AVD

## Quick Start

### 1. Navigate to Mobile App

```bash
cd apps/mobile
```

### 2. Install in Mobile Directory

```bash
pnpm install
```

### 3. Generate Android & iOS Directories (optional)

If using development builds run:

```bash
pnpm clean
```

### 4. Start Development Server

```bash
# From the mobile app directory
pnpm dev
```

### 5. Run on Device/Simulator

#### Using Expo Go

1. Install Expo Go on your device
2. Scan the QR code from the terminal
3. The app will load on your device

#### Using Development Build

```bash
# iOS (requires macOS)
pnpm ios

# Android
pnpm android
```

:::tip[Injecting Environment Variables]

Running `pnpm dev/android/ios` will automatically inject the required envs into the development process provided that you have logged in with infisical. If you are not logged in, the commands will fail and prompt you to run `infisical login`.
:::

## Development Workflow

### 1. Using Shared Components

Import shared UI components from the shared package:

```tsx
import { Button, Card, Input } from '@repo/ui';
import { Text, View } from 'react-native';

export default function LoginScreen() {
  return (
    <View className="flex-1 p-4">
      <Card className="p-6">
        <Text className="text-2xl font-bold mb-4">Login</Text>
        <Input placeholder="Email" className="mb-4" />
        <Input placeholder="Password" secureTextEntry className="mb-4" />
        <Button title="Sign In" />
      </Card>
    </View>
  );
}
```

### 2. Navigation

Using Expo Router for navigation:

```tsx
import { router } from 'expo-router';
import { Pressable, Text } from 'react-native';

export function BookingCard({ booking }) {
  return (
    <Pressable 
      onPress={() => router.push(`/booking/${booking.id}`)}
      className="p-4 bg-white rounded-lg shadow"
    >
      <Text className="font-semibold">{booking.hotelName}</Text>
      <Text className="text-gray-600">{booking.checkIn}</Text>
    </Pressable>
  );
}
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Expo development server |
| `pnpm ios` | Run on iOS |
| `pnpm android` | Run on Android |
| `pnpm web` | Run as web app |
| `pnpm lint` | Run ESLint |
| `pnpm clean` | Clean build cache |
| `pnpm sb` | |
| `pnpm build-storybook` | |

## Related Documentation

- **[Mobile Internationalisation](./internationalisation.md)**
- **[EAS Builds](./eas-builds.md)**
- **[Logging](./logging.md)**
- **[Storybook](./storybook.md)**
- **[Web Development Guide](../web/getting-started)**
- **[API Development Guide](../api/getting-started)**
- **[Package Development](../packages/overview)**
- **[Deployment Guide](../deployment/mobile)**
- **[Expo Documentation](https://docs.expo.dev/)**
- **[React Native Documentation](https://reactnative.dev/docs/getting-started)**
