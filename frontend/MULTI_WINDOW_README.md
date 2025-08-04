# Multi-Window System Implementation

## Overview

This implementation provides a complete multi-window system for the PSX Trade Hub application, allowing users to open multiple screens simultaneously with resizable windows, similar to a desktop application.

## Features

### ✅ Multi-Window Support
- Open multiple screens simultaneously
- Each window can be independently positioned and resized
- Windows can be minimized, maximized, and closed
- Active window management with proper z-index layering

### ✅ Resizable Windows
- 8-directional resize handles (N, S, E, W, NE, NW, SE, SW)
- Minimum and maximum size constraints per window
- Smooth resize animations
- Visual feedback during resize operations

### ✅ Configuration System
- Centralized window configuration in `src/config/windowConfig.js`
- Customizable default sizes, minimum/maximum dimensions per screen
- Easy to add new screens with their specific requirements

### ✅ Window Management
- Drag and drop functionality
- Window activation (click to bring to front)
- Taskbar for minimized windows
- Proper window state management

## File Structure

```
src/
├── config/
│   └── windowConfig.js          # Window configuration and dimensions
├── components/
│   ├── ResizableWindow.jsx      # Enhanced window component with resize handles
│   ├── ResizableWindow.css      # Styles for resizable windows
│   ├── WindowManager.jsx        # Multi-window management component
│   └── WindowManager.css        # Styles for window manager
└── App.jsx                      # Updated to use multi-window system
```

## Configuration

### Window Configuration (`src/config/windowConfig.js`)

Each window has configurable properties:

```javascript
{
  title: 'Window Title',
  component: 'ComponentName',
  admin: true,                    // Optional: admin-only access
  defaultWidth: 800,              // Default window width
  defaultHeight: 600,             // Default window height
  minWidth: 400,                  // Minimum width
  minHeight: 300,                 // Minimum height
  maxWidth: 2000,                 // Maximum width
  maxHeight: 1500                 // Maximum height
}
```

### Adding New Screens

1. **Add component import** in `src/components/WindowManager.jsx`:
   ```javascript
   import NewComponent from '../NewComponent';
   ```

2. **Add to component map**:
   ```javascript
   const COMPONENT_MAP = {
     // ... existing components
     NewComponent
   };
   ```

3. **Add configuration** in `src/config/windowConfig.js`:
   ```javascript
   newcomponent: {
     title: 'New Component',
     component: 'NewComponent',
     defaultWidth: 800,
     defaultHeight: 600,
     minWidth: 600,
     minHeight: 400,
     maxWidth: 1200,
     maxHeight: 800
   }
   ```

4. **Add to menu** in `src/App.jsx`:
   ```javascript
   { key: 'newcomponent', label: 'New Component', icon: FaIcon }
   ```

## Usage

### Opening Windows
- Click menu items to open windows
- Multiple windows can be open simultaneously
- Each window opens at a calculated position to avoid overlap

### Window Controls
- **Minimize**: Reduces window to taskbar
- **Maximize**: Expands window to full screen
- **Close**: Closes the window completely
- **Resize**: Drag resize handles to resize window
- **Move**: Drag window header to move window

### Window States
- **Normal**: Standard window with resize handles
- **Maximized**: Full-screen window
- **Minimized**: Hidden window (accessible via taskbar)

## Technical Implementation

### ResizableWindow Component
- Custom resize hooks for 8-directional resizing
- Drag and drop functionality
- Z-index management for active/inactive states
- Smooth animations and transitions

### WindowManager Component
- Manages multiple window instances
- Handles window positioning and state
- Provides centralized window control
- Integrates with configuration system

### State Management
- `openWindows`: Tracks which windows are open
- `windowStates`: Manages window states (normal/minimized/maximized)
- `activeWindow`: Tracks currently active window
- `windowPositions` & `windowSizes`: Stores window positions and sizes

## CSS Features

### Resize Handles
- 8 directional handles with appropriate cursors
- Hover effects for visual feedback
- Proper z-indexing for handle interaction

### Window Styling
- Glassmorphism design with backdrop blur
- Smooth animations for all interactions
- Responsive design considerations
- Custom scrollbar styling

### Taskbar
- Fixed bottom taskbar for minimized windows
- Hover effects and smooth transitions
- Responsive design for mobile devices

## Browser Compatibility

- Modern browsers with CSS Grid and Flexbox support
- Pointer events for drag and resize functionality
- CSS backdrop-filter for glassmorphism effects
- Touch support for mobile devices

## Performance Considerations

- Efficient re-rendering with React hooks
- Debounced resize operations
- Optimized event listeners
- Minimal DOM manipulation

## Future Enhancements

- Window snapping to screen edges
- Window tiling and arrangement
- Custom window themes
- Window groups and tabs
- Keyboard shortcuts for window management
- Window state persistence across sessions 