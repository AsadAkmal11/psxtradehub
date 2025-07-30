import React, { useState, useCallback } from 'react';
import ResizableWindow from './ResizableWindow';
import { WINDOW_CONFIG, WINDOW_POSITIONING, Z_INDEX } from '../config/windowConfig';
import StockUpload from '../stockupload';
import MarketWatch from '../MarketWatch';
import CustomerPortfolio from '../CustomerPortfolio';
import Portfolio from '../Portfolio';
import Country from '../Country';
import Currency from '../Currency';
import Customers from '../Customers';
import Exchange from '../Exchange';
import Order from '../Order';
import OrdersList from '../OrdersList';
import EChartsTest from '../EChartsTest';
import ErrorBoundary from './ErrorBoundary';
import './WindowManager.css';

const WindowManager = ({ 
  openWindows, 
  windowStates,
  onWindowClose, 
  onWindowMinimize, 
  onWindowMaximize, 
  onWindowRestore,
  onWindowResize,
  activeWindow,
  onWindowActivate,
  user
}) => {
  const [windowPositions, setWindowPositions] = useState({});
  const [windowSizes, setWindowSizes] = useState({});

  // Calculate position for new windows
  const getNextWindowPosition = useCallback((windowId) => {
    const openWindowCount = Object.keys(openWindows).length;
    const { offsetX, offsetY, maxWindowsPerRow, startX, startY } = WINDOW_POSITIONING;
    
    const row = Math.floor(openWindowCount / maxWindowsPerRow);
    const col = openWindowCount % maxWindowsPerRow;
    
    return {
      x: startX + (col * offsetX),
      y: startY + (row * offsetY)
    };
  }, [openWindows]);

  // Component mapping
  const COMPONENT_MAP = {
    StockUpload,
    MarketWatch,
    CustomerPortfolio,
    Country,
    Currency,
    Customers,
    Exchange,
    Order,
    OrdersList,
    EChartsTest
  };

  // Get window configuration
  const getWindowConfig = useCallback((windowId) => {
    const config = WINDOW_CONFIG[windowId];
    if (!config) {
      return {
        title: 'Unknown Window',
        defaultWidth: 800,
        defaultHeight: 600,
        minWidth: 400,
        minHeight: 300,
        maxWidth: 2000,
        maxHeight: 1500
      };
    }
    
    // Map the component name to actual component
    const Component = COMPONENT_MAP[config.component];
    return {
      ...config,
      component: Component
    };
  }, []);

  // Handle window resize
  const handleWindowResize = useCallback((windowId, newSize) => {
    setWindowSizes(prev => ({
      ...prev,
      [windowId]: newSize
    }));
    if (onWindowResize) {
      onWindowResize(windowId, newSize);
    }
  }, [onWindowResize]);

  // Handle window activation
  const handleWindowActivate = useCallback((windowId) => {
    if (onWindowActivate) {
      onWindowActivate(windowId);
    }
  }, [onWindowActivate]);

  return (
    <div className="window-manager">
      {Object.entries(openWindows).map(([windowId, isOpen]) => {
        const config = getWindowConfig(windowId);
        const windowState = windowStates[windowId] || 'normal';
        const position = windowPositions[windowId] || getNextWindowPosition(windowId);
        const size = windowSizes[windowId] || {
          width: config.defaultWidth,
          height: config.defaultHeight
        };
        const isActive = activeWindow === windowId;

        // Check if user has access to this window
        if (config.admin && (!user || user.role !== 'admin')) {
          return null;
        }

        return (
          <ResizableWindow
            key={windowId}
            id={windowId}
            title={config.title}
            windowState={windowState}
            onMinimize={() => onWindowMinimize(windowId)}
            onMaximize={() => onWindowMaximize(windowId)}
            onRestore={() => onWindowRestore(windowId)}
            onClose={() => onWindowClose(windowId)}
            onResize={(newSize) => handleWindowResize(windowId, newSize)}
            onActivate={() => handleWindowActivate(windowId)}
            initialPosition={position}
            initialSize={size}
            minSize={{ width: config.minWidth, height: config.minHeight }}
            maxSize={{ width: config.maxWidth, height: config.maxHeight }}
            zIndex={Z_INDEX.base + (isActive ? 1 : 0)}
            isActive={isActive}
            draggable={windowState === 'normal'}
          >
            <div className="window-content-wrapper">
              <ErrorBoundary>
                {React.createElement(config.component, {
                  onBack: () => onWindowClose(windowId)
                })}
              </ErrorBoundary>
            </div>
          </ResizableWindow>
        );
      })}
    </div>
  );
};

export default WindowManager; 