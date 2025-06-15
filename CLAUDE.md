# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start the development server (Next.js)
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run Next.js linting

### Dependencies
- `npm install --legacy-peer-deps` - Install all dependencies (use legacy-peer-deps due to React 19)

## Architecture Overview

This is a Next.js 15.2.4 application that serves as a **Screenshot Text Editor** - a tool for creating visually appealing text highlights and formatted content that can be exported as PNG images for social media sharing.

### Core Features

1. **Main Editor Component** (`app/page.tsx`):
   - Dual editor modes: Markdown and HTML
   - Real-time preview with custom markdown renderer
   - Undo/redo functionality with history management
   - Copy to clipboard and download PNG export options
   - Preview-only mode for distraction-free viewing

2. **Export System**:
   - Uses `modern-screenshot` library for accurate PNG generation
   - Primary action: Copy to clipboard
   - Secondary action: Download as PNG file
   - Visual feedback with checkmark when copied

3. **Markdown Processing**:
   - Custom highlight syntax: `===text===` 
   - Standard markdown features (bold, headers, lists, blockquotes)
   - Support for ordered lists with custom starting numbers
   - Keyboard shortcuts (⌘H for highlight, ⌘B for bold, ⌘Z/⌘Y for undo/redo)

4. **Typography System**:
   - Dual font system: separate fonts for body and headers/bold text
   - 26 font options including serif, sans-serif, and modern aesthetic fonts
   - Dynamic font size (12-32px) and line height (1.0-2.0)
   - Font families imported from Google Fonts and CDN

5. **Preset Templates** (15 total):
   - Social media: Twitter Post, Instagram Story, LinkedIn Post
   - Content types: Literary Essay, Academic Paper, Poetry, Quote Card
   - Modern styles: Startup Pitch, Newsletter, Tech Article, Notion Style
   - Classic styles: Philosophy, Modern Blog, Blog Header, Minimal

### Key Technical Details

- **Path Aliases**: Use `@/` to import from project root
- **UI Components**: Extensive use of Shadcn/ui components in `components/ui/`
- **State Management**: React hooks with local state, including `copied` state for clipboard feedback
- **Export Feature**: Uses `modern-screenshot` (domToPng, domToBlob) for reliable PNG generation
- **History Management**: Debounced updates (800ms) for smooth typing experience
- **Font Loading**: Google Fonts and custom fonts loaded via style tags

### Important Patterns

1. When modifying the editor, maintain the dual font system where headers and bold text can use a different font family
2. The highlight renderer uses a custom marked extension to parse `===text===` syntax
3. Undo/redo implementation uses a history array with cursor position tracking
4. Export function handles both copy and download actions with proper error handling
5. All UI components follow Shadcn/ui patterns and are located in `components/ui/`
6. Use `--legacy-peer-deps` when installing packages due to React 19 compatibility