---
sidebar_position: 10
---

# Troubleshooting Guide

This guide covers common issues and solutions when working with the ts monorepo.

## General Issues

### Installation Problems

#### Dependency Issues

```bash
# Clear caches and reinstall
pnpm store prune
rm -rf pnpm-lock.yaml
find . -name 'node_modules' -type d -prune -exec rm -rf '{}' +
pnpm install
```

### Build Issues

## Web Development Issues

### Next.js Build Failures

### Firebase Integration Issues

## Mobile Development Issues

### Expo Development Problems

### Platform-Specific Issues

### React Native Issues

## API Development Issues

### Firebase Functions Problems

### Database Issues

## Package Development Issues

### Storybook Problems

### TypeScript Issues

## Getting Help

### Documentation Resources

- **[Next.js Documentation](https://nextjs.org/docs)**
- **[Expo Documentation](https://docs.expo.dev/)**
- **[Firebase Documentation](https://firebase.google.com/docs)**
- **[React Native Documentation](https://reactnative.dev/docs/getting-started)**

### Community Support

- **[Next.js GitHub Discussions](https://github.com/vercel/next.js/discussions)**
- **[Expo Forums](https://forums.expo.dev/)**
- **[Firebase Support](https://firebase.google.com/support)**
- **[React Native Community](https://github.com/react-native-community)**

### Internal Support

1. **Check existing documentation** in this wiki
2. **Ask team members** in developer Slack channel
