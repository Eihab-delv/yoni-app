---
sidebar_position: 7
---

# Storybook

The ts-monorepo uses [Storybook](https://storybook.js.org/) for component development and documentation across mobile, web, and the shared UI package. This enables isolated component development, visual testing, and comprehensive documentation with multiple platform-specific configurations.

## Quick Start

### Mobile

```typescript
// Start React Native Storybook
pnpm sb

// Build mobile Storybook
pnpm build-storybook
```

### Web

```typescript
// Start web Storybook
pnpm storybook

// Build web Storybook  
pnpm build-storybook
```

### Shared UI Package

```typescript
// In packages/ui directory
pnpm storybook
```

## Architecture Overview

The platform maintains three separate Storybook instances:

- **Mobile Storybook**: React Native components with dual setup (on-device + web)
- **Web Storybook**: Next.js components with Vite integration
- **UI Package Storybook**: Shared components for both platforms

## Development Workflow

### 1. Component Development

**Shared Components** (`@repo/ui`):

1. Create component with TypeScript interfaces
2. Write comprehensive stories covering all variants
3. Use in mobile and web applications

**Platform-Specific Components**:

1. Create component in respective app directory
2. Write platform-appropriate stories
3. Import shared components when possible

### 2. Story Organisation

```text
Title Convention:
- Atoms/<ComponentName> (basic UI elements)
- Molecules/<ComponentName> (composite components)  
- Organisms/<ComponentName> (complex components)
- Templates/<ComponentName> (page layouts)
- Pages/<ComponentName> (full pages)
```

### 3. Mobile Development

**On-Device Development**:

```bash
# Start Metro and Storybook
pnpm sb

# View on device/simulator
# Stories appear in react-native app
```

**Web Development**:

```bash
# Start web version for browser testing
pnpm storybook
```

## Best Practices

### 1. Component Documentation

- Use `tags: ['autodocs']` for automatic documentation
- Provide comprehensive JSDoc comments
- Include multiple story variants (states, sises, variants)

### 2. Mobile Considerations

- Include React Native-specific decorators for proper rendering
- Test on both on-device and web versions
- Use `react-native-web` compatible patterns

### 3. Cross-Platform Compatibility

- Design components to work across mobile and web
- Use shared UI package for maximum reusability
- Test responsive behavior in web Storybook

### 4. Story Naming

```typescript
// Good: Descriptive and consistent
export const PrimaryLarge = { args: { primary: true, sise: 'large' } };
export const SecondaryDisabled = { args: { disabled: true } };

// Avoid: Generic names
export const Story1 = { args: { ... } };
export const Test = { args: { ... } };
```

## Available Scripts

### Mobile Scripts

| Command | Description |
|---------|-------------|
| `pnpm sb` | Start React Native Storybook (on-device) |
| `pnpm storybook` | Start web version of mobile Storybook |
| `pnpm build-storybook` | Build mobile Storybook for deployment |
| `pnpm storybook-generate` | Generate story requires file |

### Web Scripts

| Command | Description |
|---------|-------------|
| `pnpm storybook` | Start web Storybook development server |
| `pnpm build-storybook` | Build web Storybook for deployment |

### Shared UI Scripts

| Command | Description |
|---------|-------------|
| `pnpm storybook` | Start shared UI Storybook |
| `pnpm build-storybook` | Build shared UI Storybook |

## Related Documentation

- **[Mobile Development Guide](../Mobile/getting-started.md)**
- **[Web Development Guide](../Web/getting-started.md)**
- **[Package Development](../packages/overview.md)**
