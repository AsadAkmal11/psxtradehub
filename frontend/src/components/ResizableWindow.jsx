import React, { useState, useRef, useCallback } from "react";
import "./ResizableWindow.css";

function useDraggable(initialPosition, canDrag) {
  const dragging = React.useRef(false);
  const offset = React.useRef({ x: 0, y: 0 });
  const [position, setPosition] = React.useState(() => initialPosition);

  const onPointerDown = (e) => {
    if (!canDrag) return;
    e.preventDefault();
    dragging.current = true;
    const rect = e.target.closest('.resizable-window').getBoundingClientRect();
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
  };

  const onPointerMove = (e) => {
    if (!dragging.current) return;
    e.preventDefault();
    setPosition({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    });
  };

  const onPointerUp = () => {
    dragging.current = false;
    window.removeEventListener('mousemove', onPointerMove);
    window.removeEventListener('mouseup', onPointerUp);
  };

  return { position, onPointerDown };
}

function useResizable(initialSize, minSize, maxSize, onResize) {
  const [size, setSize] = useState(initialSize);
  const resizing = useRef(false);
  const startSize = useRef({ width: 0, height: 0 });
  const startPos = useRef({ x: 0, y: 0 });

  const constrainSize = useCallback((newWidth, newHeight) => {
    return {
      width: Math.max(minSize.width, Math.min(maxSize.width, newWidth)),
      height: Math.max(minSize.height, Math.min(maxSize.height, newHeight))
    };
  }, [minSize, maxSize]);

  const handleResizeStart = useCallback((e, direction) => {
    e.preventDefault();
    e.stopPropagation();
    resizing.current = true;
    startSize.current = { ...size };
    startPos.current = { x: e.clientX, y: e.clientY };
    
    const handleMouseMove = (e) => {
      if (!resizing.current) return;
      e.preventDefault();
      
      const deltaX = e.clientX - startPos.current.x;
      const deltaY = e.clientY - startPos.current.y;
      
      let newWidth = startSize.current.width;
      let newHeight = startSize.current.height;
      
      if (direction.includes('e')) newWidth += deltaX;
      if (direction.includes('w')) newWidth -= deltaX;
      if (direction.includes('s')) newHeight += deltaY;
      if (direction.includes('n')) newHeight -= deltaY;
      
      const constrainedSize = constrainSize(newWidth, newHeight);
      setSize(constrainedSize);
      if (onResize) onResize(constrainedSize);
    };
    
    const handleMouseUp = () => {
      resizing.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [size, constrainSize, onResize]);

  return { size, handleResizeStart };
}

const ResizableWindow = ({
  id,
  title,
  children,
  windowState = "normal",
  onMinimize,
  onMaximize,
  onRestore,
  onClose,
  onResize,
  draggable = true,
  initialPosition = { x: 120, y: 120 },
  initialSize = { width: 800, height: 600 },
  minSize = { width: 400, height: 300 },
  maxSize = { width: 2000, height: 1500 },
  style = {},
  zIndex = 1000,
  isActive = false,
  onActivate
}) => {
  const canDrag = draggable && windowState === "normal";
  const { position, onPointerDown } = useDraggable(initialPosition, canDrag);
  const { size, handleResizeStart } = useResizable(initialSize, minSize, maxSize, onResize);

  const baseStyle = windowState === "maximized"
    ? { 
        top: 0, 
        left: 0, 
        width: "100vw", 
        height: "100vh", 
        position: "fixed",
        zIndex: zIndex + (isActive ? 1 : 0)
      }
    : windowState === "minimized"
    ? { 
        width: 320, 
        height: 56, 
        minHeight: 0, 
        maxHeight: 56, 
        top: "2.2rem", 
        left: "2.2rem", 
        position: "absolute",
        zIndex: zIndex + (isActive ? 1 : 0)
      }
    : { 
        left: position.x, 
        top: position.y, 
        width: size.width,
        height: size.height,
        position: "absolute",
        zIndex: zIndex + (isActive ? 1 : 0)
      };

  const combinedStyle = { ...baseStyle, ...style };

  if (windowState === "minimized") return null;

  return (
    <div
      className={`resizable-window ${windowState} ${canDrag ? "draggable-window" : ""} ${isActive ? "active" : ""}`}
      style={combinedStyle}
      onClick={onActivate}
    >
      <div
        className="window-header"
        style={canDrag ? { cursor: "move" } : {}}
        onMouseDown={onPointerDown}
      >
        <span className="window-title">{title}</span>
        <div className="window-controls">
          <button onClick={onMinimize} title="Minimize" className="window-btn">-</button>
          <button
            onClick={windowState === "maximized" ? onRestore : onMaximize}
            title={windowState === "maximized" ? "Restore" : "Maximize"}
            className="window-btn"
          >
            {windowState === "maximized" ? "🗗" : "▢"}
          </button>
          <button onClick={onClose} title="Close" className="window-btn">×</button>
        </div>
      </div>
      
      {windowState !== "minimized" && (
        <div className="window-content">
          {children}
        </div>
      )}

      {/* Resize handles - only show when not maximized */}
      {windowState === "normal" && (
        <>
          <div 
            className="resize-handle resize-n" 
            onMouseDown={(e) => handleResizeStart(e, 'n')}
            title="Resize"
          />
          <div 
            className="resize-handle resize-s" 
            onMouseDown={(e) => handleResizeStart(e, 's')}
            title="Resize"
          />
          <div 
            className="resize-handle resize-e" 
            onMouseDown={(e) => handleResizeStart(e, 'e')}
            title="Resize"
          />
          <div 
            className="resize-handle resize-w" 
            onMouseDown={(e) => handleResizeStart(e, 'w')}
            title="Resize"
          />
          <div 
            className="resize-handle resize-ne" 
            onMouseDown={(e) => handleResizeStart(e, 'ne')}
            title="Resize"
          />
          <div 
            className="resize-handle resize-nw" 
            onMouseDown={(e) => handleResizeStart(e, 'nw')}
            title="Resize"
          />
          <div 
            className="resize-handle resize-se" 
            onMouseDown={(e) => handleResizeStart(e, 'se')}
            title="Resize"
          />
          <div 
            className="resize-handle resize-sw" 
            onMouseDown={(e) => handleResizeStart(e, 'sw')}
            title="Resize"
          />
        </>
      )}
    </div>
  );
};

export default ResizableWindow; 