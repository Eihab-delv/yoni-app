---
sidebar_position: 1
---

# Packages Development Guide

This guide covers working with the shared packages in the monorepo that provide shared functionality and resources across all applications.

## Overview

The monorepo includes several shared packages:

- **`@repo/common`** - Shared utilities, types, and business logic across apps & services
- **`@repo/ui`** - Reusable UI components for web and mobile apps
- **`@repo/core`** - Core business logic and domain models for services
- **`@repo/openapi-schema`** - API schema definitions and types used in apps

## Working with Packages

### Building Packages

All packages must be built before they can be used by applications:

```bash
# Build all packages
pnpm build:packages

# Build specific packages
pnpm build --filter @repo/ui
pnpm build --filter @repo/common

# Build packages in watch mode during development
pnpm watch --filter @repo/ui
```

## @repo/common Package

The common package provides shared utilities and types.

### Key Features

- **API Client** - Type-safe HTTP client
- **Authentication** - Firebase Auth integration
- **Types** - Shared TypeScript definitions
- **Utilities** - Helper functions and constants

### Usage Examples

#### API Client

```typescript
import { api } from '@repo/common';

// Type-safe API calls
const bookings = await api.bookings.list();
const user = await api.users.getProfile();
const hotel = await api.hotels.getDetails('hotel-123');
```

#### Authentication

```typescript
import { useAuth } from '@repo/common';

export function LoginButton() {
  const { user, signIn, signOut, isLoading } = useAuth();
  
  if (isLoading) return <div>Loading...</div>;
  
  return user ? (
    <button onClick={signOut}>Sign Out</button>
  ) : (
    <button onClick={signIn}>Sign In</button>
  );
}
```

#### Types

```typescript
import type { User, Booking, Hotel } from '@repo/common';

interface BookingListProps {
  bookings: Booking[];
  user: User;
}

export function BookingList({ bookings, user }: BookingListProps) {
  return (
    <div>
      {bookings.map(booking => (
        <BookingCard key={booking.id} booking={booking} />
      ))}
    </div>
  );
}
```

## @repo/ui Package

The UI package provides reusable components & translations for both web and mobile apps.

### Usage Examples

#### Web Components

```tsx
import { Button, Card, Input } from '@repo/ui';

export function LoginForm() {
  return (
    <Card className="p-6">
      <Input 
        placeholder="Email" 
        type="email"
        className="mb-4"
      />
      <Input 
        placeholder="Password" 
        type="password"
        className="mb-4"
      />
      <Button variant="primary" size="lg">
        Sign In
      </Button>
    </Card>
  );
}
```

#### Mobile Components

```tsx
import { Button, Card, Input } from '@repo/ui';

export function LoginForm() {
  return (
    <Card style={{ padding: 24 }}>
      <Input 
        placeholder="Email" 
        keyboardType="email-address"
        style={{ marginBottom: 16 }}
      />
      <Input 
        placeholder="Password" 
        secureTextEntry
        style={{ marginBottom: 16 }}
      />
      <Button variant="primary" size="lg">
        Sign In
      </Button>
    </Card>
  );
}
```

## @repo/core Package

The core package contains business logic and domain models.

### Key Features

- **Domain Models** - Business entities and their methods
- **Services** - Business logic and operations
- **Validators** - Data validation schemas

### Usage Examples

#### Domain Models

```typescript
// packages/core/src/models/Booking.ts
export class Booking {
  constructor(
    public id: string,
    public userId: string,
    public hotelId: string,
    public checkIn: Date,
    public checkOut: Date,
    public guests: number,
    public status: BookingStatus
  ) {}

  get duration(): number {
    const diffTime = this.checkOut.getTime() - this.checkIn.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  canCancel(): boolean {
    const now = new Date();
    const daysBefore = (this.checkIn.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return daysBefore >= 1 && this.status === 'confirmed';
  }

  calculateTotal(roomRate: number): number {
    return this.duration * roomRate * this.guests;
  }
}
```

#### Services

```typescript
// packages/core/src/services/BookingService.ts
import { Booking } from '../models/Booking';

export class BookingService {
  async createBooking(data: CreateBookingData): Promise<Booking> {
    // Validate availability
    const isAvailable = await this.checkAvailability(data);
    if (!isAvailable) {
      throw new Error('Hotel not available for selected dates');
    }

    // Calculate pricing
    const pricing = await this.calculatePricing(data);

    // Create booking
    const booking = new Booking(
      generateId(),
      data.userId,
      data.hotelId,
      data.checkIn,
      data.checkOut,
      data.guests,
      'pending'
    );

    return booking;
  }

  private async checkAvailability(data: CreateBookingData): Promise<boolean> {
    // Implementation
    return true;
  }
}
```

## @repo/openapi-schema Package

This package generates TypeScript types from OpenAPI schemas.

## Related Documentation

- **[Web Development Guide](../web/getting-started)**
- **[Mobile Development Guide](../mobile/getting-started)**
- **[API Development Guide](../api/getting-started)**
- **[Storybook Documentation](https://storybook.js.org/docs)**
- **[Zod](https://zod.dev/)**
