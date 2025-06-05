# Custom Background Themes Implementation

This document outlines the implementation of the custom background theme system for Pingpad, which adds subtle radial gradients to the app's background.

## Features Implemented

✅ **Settings Section for Theming** - Enhanced the existing settings page with comprehensive theme controls  
✅ **Background Color Selection** - 6 predefined gradient themes with preview functionality  
✅ **Local Storage Persistence** - User preferences are saved and restored automatically  
✅ **Light/Dark Mode Support** - Each gradient theme has optimized light and dark variants  
✅ **Subtle Gradient Design** - Very low opacity (0.05-0.1) to ensure content readability  

## Architecture

### 1. Custom Hook: `useBackgroundTheme`
Located: `src/hooks/useBackgroundTheme.ts`

- Manages background theme state with React hooks
- Handles localStorage persistence with key `pingpad-background-theme`
- Integrates with existing `next-themes` for light/dark mode detection
- Provides 6 predefined themes: Default, Purple, Orange, Teal, Rose, Indigo

### 2. Background Gradient Component
Located: `src/components/BackgroundGradient.tsx`

- Renders a fixed-position overlay with the selected gradient
- Uses `-z-10` to stay behind all content
- Dynamically applies the correct light/dark variant based on current theme

### 3. Theme Settings UI
Located: `src/components/BackgroundThemeSettings.tsx`

- Grid-based preview interface showing all available gradients
- Interactive theme selection with visual feedback
- Real-time preview showing how gradients look in current light/dark mode
- Integrated with existing shadcn/ui components

### 4. Comprehensive Theme Settings
Located: `src/components/ThemeSettings.tsx`

- Combines existing color theme toggle with new background theme selection
- Clean, organized layout using card components
- Replaces the previous inline theme controls in settings

## Integration Points

### Root Layout Update
The `BackgroundGradient` component is added to `src/app/layout.tsx` inside the theme providers, ensuring:
- Gradients are applied app-wide
- Proper SSR/hydration handling
- Consistent z-index layering

### Settings Page Enhancement
Updated `src/app/(title)/settings/page.tsx` to use the new comprehensive `ThemeSettings` component instead of basic theme buttons.

## Gradient Design Philosophy

All gradients use:
- **Radial gradients** positioned at different corners/edges
- **Very low opacity** (0.05 for light mode, 0.1 for dark mode)
- **Multiple overlapping gradients** for depth and visual interest
- **Semantic color combinations** that complement the app's design system

## Theme Definitions

### Default (Blue-Green)
- Light: Blue and emerald radial gradients at 5% opacity
- Dark: Same colors at 10% opacity

### Purple (Purple-Pink)
- Light: Violet and pink radial gradients
- Dark: Enhanced visibility with higher opacity

### Orange (Orange-Red)
- Light: Orange and red warm tones
- Dark: Warmer, more vibrant appearance

### Teal (Cyan-Emerald)
- Light: Cool cyan and emerald combination
- Dark: Enhanced cool tones

### Rose (Rose-Pink)
- Light: Rose and light pink combination
- Dark: Deeper rose tones

### Indigo (Indigo-Violet)
- Light: Deep indigo and violet
- Dark: Rich purple gradients

## Technical Features

- **SSR-safe**: All components handle hydration properly
- **Performance optimized**: Uses CSS transforms and fixed positioning
- **Accessible**: Maintains content readability with subtle opacity
- **Type-safe**: Full TypeScript implementation
- **Responsive**: Works across all device sizes

## Usage

Users can access the new background theme settings by:
1. Navigating to `/settings`
2. Scrolling to the "Background Themes" section
3. Clicking on any gradient preview to select it
4. Changes are automatically saved and applied immediately

The selected background theme persists across sessions and adapts automatically when switching between light and dark modes.