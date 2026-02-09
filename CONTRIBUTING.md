# Contributing to Leo Player

First off, thank you for considering contributing to Leo Player! 🎉

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)

## Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow:

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on what is best for the community
- Show empathy towards other community members

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates.

**When creating a bug report, include:**
- Clear and descriptive title
- Exact steps to reproduce the problem
- Expected vs actual behavior
- Screenshots/videos if applicable
- Environment details (OS, browser, version)
- Error messages/console logs

**Use this template:**
```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
1. Go to '...'
2. Click on '....'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
 - OS: [e.g., Windows 10]
 - Browser: [e.g., Chrome 120]
 - Version: [e.g., 0.1.0]

**Additional context**
Any other context about the problem.
```

### Suggesting Features

Feature requests are welcome! Please provide:

- Clear and descriptive title
- Detailed description of the feature
- Use cases and benefits
- Mockups or examples (if applicable)
- Willingness to implement (optional)

**Use this template:**
```markdown
**Feature Request**

**Is your feature request related to a problem?**
Describe the problem.

**Describe the solution you'd like**
Clear description of what you want to happen.

**Describe alternatives you've considered**
Other solutions or features you've considered.

**Additional context**
Mockups, screenshots, or examples.
```

### Contributing Code

#### Good First Issues

Look for issues labeled:
- `good first issue` - Great for newcomers
- `help wanted` - Need community help
- `bug` - Bug fixes needed
- `enhancement` - New features

#### Areas for Contribution

1. **Player Features**
   - Equalizer presets
   - Playlist management
   - Keyboard shortcuts
   - Chromecast support

2. **UI/UX**
   - Mobile responsiveness
   - Accessibility improvements
   - Dark mode enhancements
   - Animation polish

3. **Performance**
   - Loading optimizations
   - Caching strategies
   - Bundle size reduction

4. **Documentation**
   - Tutorial videos
   - API documentation
   - Code comments
   - Translation

## Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Git
- Firebase account (for testing)
- Google Cloud account (for Drive API)

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork:
```bash
git clone https://github.com/YOUR_USERNAME/leo-player.git
cd leo-player
```

3. Add upstream remote:
```bash
git remote add upstream https://github.com/praveen2git/leo-player.git
```

### Install Dependencies

```bash
npm install
```

### Set Up Environment

1. Copy `.env.example` to `.env`
2. Fill in your credentials (see SETUP.md)

### Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

### Run Tests (Coming Soon)

```bash
npm test
```

## Pull Request Process

### Before Submitting

1. **Sync with upstream**:
```bash
git fetch upstream
git checkout main
git merge upstream/main
```

2. **Create a feature branch**:
```bash
git checkout -b feature/your-feature-name
```

3. **Make your changes**:
- Write clean, readable code
- Follow coding standards
- Add comments for complex logic
- Update documentation if needed

4. **Test thoroughly**:
- Test on different browsers
- Check mobile responsiveness
- Verify no console errors

5. **Commit your changes**:
```bash
git add .
git commit -m "feat: add amazing feature"
```

### Submitting Pull Request

1. **Push to your fork**:
```bash
git push origin feature/your-feature-name
```

2. **Create PR on GitHub**:
- Go to your fork on GitHub
- Click "New Pull Request"
- Select your feature branch
- Fill in the PR template

3. **PR Template**:
```markdown
## Description
Brief description of changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested locally
- [ ] Tested on mobile
- [ ] No console errors
- [ ] All existing features work

## Screenshots
If applicable, add screenshots.

## Related Issues
Closes #123
```

4. **Wait for review**:
- Address review comments
- Push additional commits if needed
- Be patient and respectful

### After PR Merge

1. **Delete branch**:
```bash
git branch -d feature/your-feature-name
git push origin --delete feature/your-feature-name
```

2. **Sync main**:
```bash
git checkout main
git pull upstream main
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types/interfaces
- Avoid `any` type
- Use meaningful variable names

### React

- Use functional components with hooks
- Extract reusable logic to custom hooks
- Keep components small and focused
- Use proper prop types

### Styling

- Use Tailwind CSS utility classes
- Follow existing color scheme
- Ensure responsive design
- Test on mobile devices

### File Organization

```
src/
  ├── components/
  │   ├── FeatureName/
  │   │   ├── FeatureName.tsx
  │   │   ├── FeatureName.test.tsx
  │   │   └── index.ts
  │   └── ui/
  ├── lib/
  ├── store/
  └── types/
```

### Code Examples

**Good:**
```typescript
interface AudioPlayerProps {
  fileUrl: string;
  onEnded: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  fileUrl, 
  onEnded 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Component logic
  
  return (
    <div className="flex items-center space-x-4">
      {/* Player UI */}
    </div>
  );
};
```

**Bad:**
```typescript
export const AudioPlayer = (props: any) => {
  const [x, setX] = useState(false);
  return <div>{/* ... */}</div>;
};
```

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

### Format
```
type(scope): subject

body (optional)

footer (optional)
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, missing semicolons)
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Adding tests
- `chore`: Maintenance tasks

### Examples

```bash
# Feature
git commit -m "feat(player): add shuffle mode"

# Bug fix
git commit -m "fix(auth): resolve login redirect issue"

# Documentation
git commit -m "docs: update setup instructions"

# With body
git commit -m "feat(drive): implement infinite scroll

- Add IntersectionObserver for lazy loading
- Fetch next page when near bottom
- Update loading state"
```

## Questions?

Feel free to:
- Open a discussion on GitHub
- Comment on existing issues
- Reach out via email: [your-email]

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Thanked in the README

---

**Thank you for contributing! 🙏**
