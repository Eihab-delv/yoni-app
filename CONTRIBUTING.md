# Contributing

This guide outlines best practices for contributing via pull requests (PRs) in our project. Following these guidelines ensures a smooth review process and helps maintain our code quality standards.

## Creating a Branch

1. Copy the task name (including task ID) from our project board (YouTrack)
2. Use this exact task name as your branch name
3. Create your branch from the latest `main` branch

**Example:** `NDEV-2311-remove-alert-on-ios`

## Creating a Pull Request

### Title Format Requirements

> [!IMPORTANT]
> PR titles must follow this exact format to pass automated validation. PRs with incorrect formatting will be automatically rejected.

```text
<type>(<scope>): <branch-name>

# Valid Examples:

fix(mobile): NDEV-2311-remove-alert-on-ios

feat(api/mobile/web): NDEV-2892-implement-fetch-user-api
```

> [!NOTE]
> Each PR title has 3 required components that help categorize and track changes effectively.

#### 1. Type (Required)

Choose the appropriate commit type for your changes:

- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `test`: Adding or updating tests
- `ci`: Continuous integration changes
- `refactor`: Code restructuring without functionality changes
- `perf`: Performance improvements
- `chore`: Maintenance tasks
- `revert`: Reverting changes
- `style`: Code style updates

#### 2. Scope (Required)

Select the module(s) your changes affect. Use forward slashes to separate multiple scopes:

**Primary Scopes:**

- `mobile` - React Native/Expo mobile app
- `web` - Next.js web application  
- `api` - Backend API services
- `wiki` - Documentation site

**Package Scopes:**

- `common` - Shared utilities and types
- `core` - Core business logic
- `ui` - Shared UI components
- `fns` / `functions` - Cloud functions

**Infrastructure Scopes:**

- `eslint-config` - Linting configuration
- `packages` - Package management
- `services` - Backend services
- `apps` - Application configuration

> [!TIP]
> For changes affecting multiple areas, use: `feat(api/mobile/web): NDEV-123-feature-name`

#### 3. Branch Name (Required)

Use your exact YouTrack task name as the branch name. This links your PR to the corresponding task.

### Writing an Effective PR Description

> [!TIP]
> Our [PULL_REQUEST_TEMPLATE](.github/PULL_REQUEST_TEMPLATE.md) automatically populates new PRs with required sections and checklists to guide you through the process.

A well-written description helps reviewers understand your changes quickly and provides context for future reference.

**Required Information:**

1. **Problem Statement** - What issue does this PR solve?
2. **Solution Approach** - How does your implementation solve the problem?
3. **Context & Background** - Any relevant background information
4. **Testing Approach** - How you verified your changes work

#### Visual Documentation for UI Changes

> [!IMPORTANT]
> All UI-related changes MUST include visual documentation. PRs without proper screenshots will be rejected.

**Required for UI Changes:**

- **Before/After Screenshots** - Show the visual difference your changes make
- **Multiple Screen Sizes** - Demonstrate responsive behavior (mobile, tablet, desktop)
- **Interactive Behavior** - Screen recordings for animations, transitions, or complex interactions
- **Cross-Platform Testing** - Screenshots from both iOS and Android for mobile changes

**Testing Documentation:**

- **Device Testing** - List specific devices/browsers tested
- **Environment** - Specify testing environment (development, staging)
- **Edge Cases** - Document any edge cases tested

### Code Testing Requirements

> [!WARNING]
> PRs without adequate testing will be rejected. Plan your testing approach before submitting.

### Using the PR Checklists

The PR template includes workspace-specific checklists. **Remove sections that don't apply** to your changes to keep the PR focused:

- **Web Checklist** - For Next.js web app changes
- **Mobile Checklist** - For React Native/Expo changes  
- **API Checklist** - For backend service changes
- **Packages Checklist** - For shared package modifications
- **General Checklist** - Always applicable for code quality standards

## Code Quality Standards

### Code Style Requirements

> [!TIP]
> Consistent code style reduces review time and improves maintainability.

**Essential Standards:**

- **TypeScript Typing** - All variables and functions must be explicitly typed
- **Naming Conventions** - Follow established patterns for variables, functions, and components
- **Clean Code** - Remove unused imports, variables, comments, and files
- **ESLint Compliance** - Fix all linting errors before submitting

### Functionality Best Practices

> [!TIP]
> These practices ensure robust, maintainable code that follows our architectural patterns.

**Implementation Guidelines:**

- **Leverage Existing Solutions** - Use established npm packages instead of custom implementations
- **Complete State Management** - Implement loading, error, and empty states for all components
- **Accessibility** - Ensure interactive elements are keyboard accessible
- **Data Fetching** - Use React Query for all async state management
- **Error Handling** - Implement proper error boundaries and fallback behavior

### Performance & Architecture

> [!TIP]
> Consider performance implications from the start of development.

**Performance Standards:**

- **Component Design** - Create generic, reusable components when appropriate
- **State Management** - Avoid prop drilling beyond 2 levels; use context or state management
- **Optimisation** - Memoise expensive computations and virtualize large lists

## PR Review Process

Your PR will go through both automated and manual validation before it can be merged.

### Automated Validation (GitHub Actions)

Our automated systems check your PR for:

**Title Validation:**

- Correct type and scope format
- Proper formatting and structure

**Testing Requirements:**

- All tests pass (unit, build)
- ESLint rules compliance
- TypeScript compilation without errors
- Project patterns and conventions adherence

> [!WARNING]
> If automated validation fails, you must fix the issues and push new commits. The validation will re-run automatically.

### Manual Code Review

All PRs require **at least 1 approval** from a designated code reviewer.

**What Reviewers Look For:**

- **Checklist Completion** - Relevant checklist items are completed
- **Code Quality** - Follows established patterns and best practices  
- **Functionality** - Changes work as intended and don't break existing features
- **Testing** - Adequate test coverage and proper testing approach
- **Documentation** - Clear PR description and any necessary code comments

**Responding to Review Feedback:**

1. **Address All Comments** - Respond to each reviewer comment
2. **Make Requested Changes** - Update code based on suggestions
3. **Re-request Review** - Once changes are made, request review again
4. **Ask Questions** - If feedback is unclear, ask for clarification

---

### Ready to Contribute?

> [!NOTE]
> Following these guidelines helps maintain our code quality standards and ensures a smooth development process for everyone.
