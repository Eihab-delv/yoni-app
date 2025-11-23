---
sidebar_position: 6
---

# Design System and Component Development

## Overview

:::tip[Atomic Design]
Following Atomic Design methodology helps create a consistent, maintainable, and
scalable design system. Always start with the smallest possible component and
build up.
:::

We follow the Atomic Design methodology for building components, using Storybook to document and develop our design system. This guide outlines our approach to component development and design system tools.

## Design System Tools

### Storybook

See our [Storybook Docs](./storybook.md)

- [Official Storybook Documentation](https://storybook.js.org/docs/react/get-started/introduction)

## Atomic Design Principles

:::warning[Component Hierarchy]

Molecules cannot contain other molecules - this is a strict rule to maintain
clean component hierarchy. If you need to combine molecules, create an organism
instead.
:::

We follow Brad Frost's [Atomic Design Methodology](https://atomicdesign.bradfrost.com/chapter-2/):

1. **Atoms**

   - Basic building blocks (buttons, inputs, labels)
   - Should be highly reusable
   - Examples: Text, Button, Icons, Avatar

2. **Molecules**

   - Simple combinations of atoms
   - Serve one specific purpose
   - Molecules cannot contain other molecules
   - Example: Profile Card (Avatar + Text)

3. **Organisms**

   - Complex combinations of molecules and other Organisms
   - Form distinct sections of interface
   - Example: Header (logo + navigation + search)

4. **Templates**

   - Page-level layouts
   - Focus on structure rather than content

5. **Pages/Views/Screens**
   - Specific instances of templates
   - Contains actual content
   - Terminology differs based on platform

## Development Workflow

### Component Creation Process

1. Check existing components first
2. Create new component if needed
3. Build in isolation using Storybook
4. Document props and usage
5. Generate test data using Zod and faker

### Best Practices

```typescript
// Example of component structure
// Atom: Button.tsx
export const Button = ({ label, onClick }: ButtonProps) => {
  return <button onClick={onClick}>{label}</button>;
};

// Story/Design file
import { faker } from '@faker-js/faker';

export default {
  title: 'Atoms/Button',
  component: Button,
};

// Use ZodMock for complex data structures
import { generateMock } from '@anatine/zod-mock';
import { UserSchema } from '@/schemas';

const mockUser = generateMock(UserSchema);
```

### Key Principles

- Separate logic from presentation
- Move side effects to logic components/pages
- Design for isolation in Storybook/Design Mode
- Use Zod and faker for consistent test data

## Testing Data Generation

```typescript
// Example of using ZodMock
import { generateMock } from '@anatine/zod-mock';
import { ProfileSchema } from '@/schemas';

// Generate mock data
const mockProfile = generateMock(ProfileSchema);

// Use in stories/design files
export const Default = () => <ProfileCard profile={mockProfile} />;
```

## Documentation Requirements

Each component should have:

1. Story/Design file with valid variations
2. Props documentation
3. Usage examples
4. Test data generation
5. Variant demonstrations

:::tip

Remember: Always check existing components before creating new ones. When
modifications are needed, consider extending existing components rather than
creating new ones from scratch.

:::

## Resources

- [Atomic Design Book](https://atomicdesign.bradfrost.com/)
- [Storybook Documentation](https://storybook.js.org/)
- [React Native Design Mode](https://github.com/murat-mehmet/react-native-design-mode)
- [Zod Documentation](https://zod.dev/)
- [Faker.js Documentation](https://fakerjs.dev/)
- [@anatine/zod-mock Documentation](https://github.com/anatine/zod-plugins/tree/main/packages/zod-mock)