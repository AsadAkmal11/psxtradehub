// Window configuration for all screens - Optimized for no scrolling
export const WINDOW_CONFIG = {
  upload: { 
    title: 'Stock Upload', 
    component: 'StockUpload', 
    admin: true,
    defaultWidth: 1200,
    defaultHeight: 800,    // Increased for table preview
    minWidth: 800,
    minHeight: 600,
    maxWidth: 1400,
    maxHeight: 1000
  },
  marketwatch: { 
    title: 'Market Watch', 
    component: 'MarketWatch',
    defaultWidth: 1200,    // Increased for better table view
    defaultHeight: 750,    // Increased for table content
    minWidth: 900,
    minHeight: 600,
    maxWidth: 1600,
    maxHeight: 1000
  },
  'customer-portfolio': { 
    title: 'Customer/Portfolio', 
    component: 'CustomerPortfolio',
    defaultWidth: 1000,
    defaultHeight: 750,    // Increased for form content
    minWidth: 800,
    minHeight: 600,
    maxWidth: 1400,
    maxHeight: 900
  },
  portfolio: { 
    title: 'Portfolio', 
    component: 'Portfolio',
    defaultWidth: 1000,
    defaultHeight: 675,    // Increased for form content
    minWidth: 800,
    minHeight: 600,
    maxWidth: 1400,
    maxHeight: 900
  },
  country: { 
    title: 'Country', 
    component: 'Country',
    defaultWidth: 800,
    defaultHeight: 650,    // Increased for form content
    minWidth: 700,
    minHeight: 500,
    maxWidth: 1200,
    maxHeight: 800
  },
  currency: { 
    title: 'Currency', 
    component: 'Currency',
    defaultWidth: 800,
    defaultHeight: 650,    // Increased for form content
    minWidth: 700,
    minHeight: 500,
    maxWidth: 1200,
    maxHeight: 800
  },
  customers: { 
    title: 'Customers Information', 
    component: 'Customers',
    defaultWidth: 1100,    // Increased for table view
    defaultHeight: 750,    // Increased for table content
    minWidth: 900,
    minHeight: 600,
    maxWidth: 1500,
    maxHeight: 1000
  },
  exchange: { 
    title: 'Exchange', 
    component: 'Exchange',
    defaultWidth: 900,
    defaultHeight: 600,    // Increased for form content
    minWidth: 700,
    minHeight: 500,
    maxWidth: 1300,
    maxHeight: 850
  },
  order: { 
    title: 'Buy/Sell Order', 
    component: 'Order',
    defaultWidth: 1065,    // For 3-column layout
    defaultHeight: 675,    // Increased for form content
    minWidth: 900,         // Increased for proper layout
    minHeight: 550,
    maxWidth: 1500,
    maxHeight: 900
  },
  orderslist: { 
    title: 'Orders List', 
    component: 'OrdersList',
    defaultWidth: 1200,    // Increased for table view
    defaultHeight: 750,    // Increased for table content
    minWidth: 900,
    minHeight: 600,
    maxWidth: 1600,
    maxHeight: 1000
  },
  EChartsTest: { 
    title: 'ECharts Test', 
    component: 'EChartsTest',
    defaultWidth: 1000,
    defaultHeight: 750,
    minWidth: 800,
    minHeight: 500,
    maxWidth: 1400,
    maxHeight: 800
  }
};

// Default window positioning strategy
export const WINDOW_POSITIONING = {
  offsetX: 50,  // Offset between windows
  offsetY: 50,
  maxWindowsPerRow: 3,  // Maximum windows per row before starting new row
  startX: 100,
  startY: 100
};

// Z-index management
export const Z_INDEX = {
  base: 1000,
  active: 1001,
  modal: 1002
}; 