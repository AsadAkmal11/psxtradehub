import React from "react";
import "./Window.css";

function useDraggable(initialPosition, canDrag) {
  const [position, setPosition] = React.useState(initialPosition);
  const dragging = React.useRef(false);
  const offset = React.useRef({ x: 0, y: 0 });

  React.useEffect(() => {
    setPosition(initialPosition);
  }, [initialPosition]);

  const onPointerDown = (e) => {
    if (!canDrag) return;
    dragging.current = true;
    // Get the offset between mouse and window top-left
    const rect = e.target.closest('.window-panel').getBoundingClientRect();
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  const onPointerMove = (e) => {
    if (!dragging.current) return;
    setPosition({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    });
  };

  const onPointerUp = () => {
    dragging.current = false;
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
  };

  return { position, onPointerDown };
}

const Window = ({
  title,
  children,
  windowState = "normal", // "normal", "minimized", "maximized"
  onMinimize,
  onMaximize,
  onRestore,
  onClose,
  draggable = true,
  initialPosition = { x: 120, y: 120 },
}) => {
  const canDrag = draggable && windowState === "normal";
  const { position, onPointerDown } = useDraggable(initialPosition, canDrag);

  const style =
    windowState === "maximized"
      ? { top: 0, left: 0, width: "100vw", height: "100vh", position: "fixed" }
      : windowState === "minimized"
      ? { width: 320, height: 56, minHeight: 0, maxHeight: 56, top: "2.2rem", left: "2.2rem", position: "absolute" }
      : { left: position.x, top: position.y, position: "absolute" };

  return (
    <div
      className={`window-panel ${windowState} ${canDrag ? "draggable-window" : ""}`}
      style={style}
    >
      <div
        className="window-header"
        style={canDrag ? { cursor: "move" } : {}}
        onPointerDown={onPointerDown}
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
      {windowState !== "minimized" && <div className="window-content">{children}</div>}
    </div>
  );
};

export default Window; 