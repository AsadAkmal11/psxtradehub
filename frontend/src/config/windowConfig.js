// Window configuration for all screens
export const WINDOW_CONFIG = {
  upload: { 
    title: 'Stock Upload', 
    component: 'StockUpload', 
    admin: true,
    defaultWidth: 1200,
    defaultHeight: 600,
    minWidth: 600,
    minHeight: 400,
    maxWidth: 1200,
    maxHeight: 800
  },
  marketwatch: { 
    title: 'Market Watch', 
    component: 'MarketWatch',
    defaultWidth: 1000,
    defaultHeight: 700,
    minWidth: 800,
    minHeight: 500,
    maxWidth: 1400,
    maxHeight: 900
  },
  'customer-portfolio': { 
    title: 'Customer/Portfolio', 
    component: 'CustomerPortfolio',
    defaultWidth: 900,
    defaultHeight: 650,
    minWidth: 700,
    minHeight: 450,
    maxWidth: 1300,
    maxHeight: 850
  },
  country: { 
    title: 'Country', 
    component: 'Country',
    defaultWidth: 750,
    defaultHeight: 550,
    minWidth: 600,
    minHeight: 400,
    maxWidth: 1100,
    maxHeight: 750
  },
  currency: { 
    title: 'Currency', 
    component: 'Currency',
    defaultWidth: 750,
    defaultHeight: 550,
    minWidth: 600,
    minHeight: 400,
    maxWidth: 1100,
    maxHeight: 750
  },
  customers: { 
    title: 'Customers Information', 
    component: 'Customers',
    defaultWidth: 900,
    defaultHeight: 650,
    minWidth: 700,
    minHeight: 450,
    maxWidth: 1300,
    maxHeight: 850
  },
  exchange: { 
    title: 'Exchange', 
    component: 'Exchange',
    defaultWidth: 800,
    defaultHeight: 600,
    minWidth: 600,
    minHeight: 400,
    maxWidth: 1200,
    maxHeight: 800
  },
  order: { 
    title: 'Buy/Sell Order', 
    component: 'Order',
    defaultWidth: 850,
    defaultHeight: 600,
    minWidth: 650,
    minHeight: 400,
    maxWidth: 1250,
    maxHeight: 800
  },
  orderslist: { 
    title: 'Orders List', 
    component: 'OrdersList',
    defaultWidth: 1000,
    defaultHeight: 700,
    minWidth: 800,
    minHeight: 500,
    maxWidth: 1400,
    maxHeight: 900
  },
  echartstest: { 
    title: 'ECharts Test', 
    component: 'EChartsTest',
    defaultWidth: 1000,
    defaultHeight: 700,
    minWidth: 800,
    minHeight: 500,
    maxWidth: 1400,
    maxHeight: 900
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