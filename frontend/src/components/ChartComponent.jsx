import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as echarts from 'echarts';

const ChartComponent = ({
  chartId = 'default-chart',
  seriesData = [],
  xAxisLabels = [],
  chartColors = ['#8100ff', '#00aaff'],
  customOptions = null,
  onLoadWidget = () => {},
  onPrepareData = () => {}
}) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [chartKey, setChartKey] = useState(0);
  const mountedRef = useRef(true);

  // Check if component is still mounted
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Safely dispose chart
  const disposeChart = useCallback(() => {
    if (chartInstance.current) {
      try {
        chartInstance.current.dispose();
      } catch (err) {
        console.warn('Error disposing chart:', err);
      }
      chartInstance.current = null;
    }
  }, []);

  // Initialize chart
  const initializeChart = useCallback(() => {
    if (!chartRef.current || !mountedRef.current) {
      return;
    }

    try {
      // Dispose any existing chart
      disposeChart();

      // Create new chart instance
      const chart = echarts.init(chartRef.current);
      chartInstance.current = chart;

      // Set chart options
      const chartOptions = customOptions || getDefaultOptions();
      chart.setOption(chartOptions);

      if (mountedRef.current) {
        setError(null);
        setIsInitialized(true);
      }

      console.log('Chart initialized successfully:', {
        chartId,
        seriesDataLength: seriesData.length,
        xAxisLabelsLength: xAxisLabels.length
      });

    } catch (err) {
      console.error('Error initializing chart:', err);
      if (mountedRef.current) {
        setError(err.message);
        setIsInitialized(false);
      }
      disposeChart();
    }
  }, [chartId, seriesData, xAxisLabels, customOptions, chartColors, disposeChart]);

  // Handle window resize
  useEffect(() => {
    const resizeHandler = () => {
      if (chartInstance.current && chartRef.current && mountedRef.current) {
        try {
          chartInstance.current.resize();
        } catch (err) {
          console.error('Error resizing chart:', err);
        }
      }
    };

    window.addEventListener('resize', resizeHandler);
    return () => window.removeEventListener('resize', resizeHandler);
  }, []);

  // Initialize chart with delay to prevent conflicts
  useEffect(() => {
    if (!chartRef.current) {
      return;
    }

    // Force re-render by changing key
    setChartKey(prev => prev + 1);
    
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (mountedRef.current) {
        initializeChart();
      }
    }, 150);

    return () => {
      clearTimeout(timer);
      disposeChart();
    };
  }, [seriesData, xAxisLabels, customOptions, chartId, initializeChart, disposeChart]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      disposeChart();
    };
  }, [disposeChart]);

  const getDefaultOptions = () => {
    // Apply colors to series data
    const coloredSeriesData = seriesData.map((series, index) => ({
      ...series,
      itemStyle: {
        color: chartColors[index % chartColors.length]
      }
    }));

    const options = {
      color: chartColors,
      grid: {
        bottom: 35,
        top: 40,
        left: 30,
        right: 30
      },
      tooltip: {
        show: true,
        trigger: 'axis',
        axisPointer: {
          type: 'none'
        }
      },
      legend: {
        show: true,
        orient: 'horizontal'
      },
      xAxis: {
        type: 'category',
        data: xAxisLabels,
        axisLabel: {
          fontSize: 11,
          formatter: (value) => (value.length > 12 ? value.substring(0, 12) + '...' : value)
        },
        splitLine: { show: true },
        inverse: false
      },
      yAxis: {
        type: 'value',
        min: (value) => value.min - 5,
        splitLine: { show: true }
      },
      series: coloredSeriesData
    };
    
    return options;
  };

  if (error) {
    return (
      <div style={{ 
        width: '100%', 
        height: '400px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        border: '1px solid #ff4444',
        backgroundColor: '#fff5f5',
        color: '#ff4444',
        padding: '20px'
      }}>
        <div>
          <h4>Chart Error</h4>
          <p>{error}</p>
          <p style={{ fontSize: '12px', marginTop: '10px' }}>
            Please check the browser console for more details.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      key={chartKey}
      id={chartId} 
      ref={chartRef} 
      style={{ 
        width: '100%', 
        height: '400px',
        border: '1px solid #e0e0e0',
        borderRadius: '4px',
        backgroundColor: isInitialized ? 'transparent' : '#f9f9f9'
      }} 
    >
      {!isInitialized && !error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: '#666'
        }}>
          Initializing chart...
        </div>
      )}
    </div>
  );
};

export default ChartComponent;
