import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';

const EChartsTest = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [colorScheme, setColorScheme] = useState('default');

  useEffect(() => {
    console.log('EChartsTest: Starting test');
    console.log('ECharts version:', echarts.version);
    
    if (!chartRef.current) {
      console.error('EChartsTest: Chart container not found');
      return;
    }

    let chart = null;

    try {
      // Dispose existing chart safely
      if (chartInstance.current) {
        try {
          chartInstance.current.dispose();
        } catch (err) {
          console.warn('Error disposing previous chart:', err);
        }
        chartInstance.current = null;
      }

      chart = echarts.init(chartRef.current);
      chartInstance.current = chart;
      
      const option = {
        title: {
          text: 'Bar Chart with Custom Colors',
          left: 'center',
          textStyle: {
            color: '#333',
            fontSize: 16
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['Sales', 'Revenue', 'Profit'],
          top: 30
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
          axisLabel: {
            color: '#666'
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: '#666'
          }
        },
        series: [
          {
            name: 'Sales',
            type: 'bar',
            data: [120, 200, 150, 80, 70, 110, 130],
            itemStyle: {
              color: getColorScheme()[0]
            }
          },
          {
            name: 'Revenue',
            type: 'bar',
            data: [90, 180, 120, 60, 50, 100, 110],
            itemStyle: {
              color: getColorScheme()[1]
            }
          },
          {
            name: 'Profit',
            type: 'bar',
            data: [60, 120, 80, 40, 30, 70, 80],
            itemStyle: {
              color: getColorScheme()[2]
            }
          }
        ]
      };

      chart.setOption(option);
      console.log('EChartsTest: Chart initialized successfully');
      
    } catch (error) {
      console.error('EChartsTest: Error initializing chart:', error);
      
      // Clean up failed chart instance
      if (chart) {
        try {
          chart.dispose();
        } catch (disposeErr) {
          console.warn('Error disposing failed chart:', disposeErr);
        }
      }
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        try {
          chartInstance.current.dispose();
          chartInstance.current = null;
        } catch (err) {
          console.warn('Error disposing chart on cleanup:', err);
        }
      }
    };
  }, [colorScheme]);

  const getColorScheme = () => {
    // Different color schemes
    const colorSchemes = {
      default: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452'],
      blue: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2'],
      green: ['#2ecc71', '#27ae60', '#16a085', '#1abc9c', '#3498db', '#2980b9', '#9b59b6'],
      red: ['#e74c3c', '#c0392b', '#e67e22', '#d35400', '#f39c12', '#f1c40f', '#2ecc71'],
      purple: ['#9b59b6', '#8e44ad', '#3498db', '#2980b9', '#1abc9c', '#16a085', '#27ae60'],
      gradient: [
        {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: '#ff6b6b' },
            { offset: 1, color: '#ee5a24' }
          ]
        },
        {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: '#4ecdc4' },
            { offset: 1, color: '#44a08d' }
          ]
        },
        {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: '#45b7d1' },
            { offset: 1, color: '#96c93d' }
          ]
        }
      ]
    };
    
    return colorSchemes[colorScheme] || colorSchemes.default;
  };

  const handleColorChange = (scheme) => {
    setColorScheme(scheme);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Bar Chart Color Customization</h2>
      <p>This demonstrates different ways to customize bar chart colors.</p>
      
      {/* Color scheme selector */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Color Scheme:</label>
        <select 
          value={colorScheme} 
          onChange={(e) => handleColorChange(e.target.value)}
          style={{ 
            padding: '5px 10px', 
            borderRadius: '4px', 
            border: '1px solid #ccc',
            marginRight: '10px'
          }}
        >
          <option value="default">Default</option>
          <option value="blue">Blue Theme</option>
          <option value="green">Green Theme</option>
          <option value="red">Red Theme</option>
          <option value="purple">Purple Theme</option>
          <option value="gradient">Gradient</option>
        </select>
      </div>

      <div 
        ref={chartRef} 
        style={{ 
          width: '100%', 
          height: '400px',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }} 
      />

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <h4>Color Customization Options:</h4>
        <ul>
          <li><strong>Single Color:</strong> Set one color for all bars</li>
          <li><strong>Multiple Colors:</strong> Different colors for each series</li>
          <li><strong>Gradient Colors:</strong> Linear gradients for visual appeal</li>
          <li><strong>Theme Colors:</strong> Predefined color palettes</li>
        </ul>
      </div>
    </div>
  );
};

export default EChartsTest; 