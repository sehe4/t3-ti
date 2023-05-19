import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register( CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TransactionHistogram = ({ transactions }) => {
    
    const intervals = [
      { label: 'Menor a $10,000', min: 0, max: 9999 },
      { label: '$10,000 - $49,999', min: 10000, max: 49999 },
      { label: '$50,000 - $99,999', min: 50000, max: 99999 },
      { label: '$100,000 - $499,999', min: 100000, max: 499999 },
      { label: '$500,000 - $999,999', min: 500000, max: 999999 },
      { label: 'Mayor a $1,000,000', min: 1000000, max: Infinity },
    ];
    const generateHistogramData = (transactions) => {
    const intervalCounts = [0, 0, 0, 0, 0, 0];
      transactions.forEach((transaction) => {
        for (let i = 0; i < intervals.length; i++) {
          const { min, max } = intervals[i];
          if (transaction.amount >= min && transaction.amount <= max) {
            intervalCounts[i]++;
            break;
          }
        }
      });
  
      return intervalCounts;
    };
  
    const data = {
      labels: intervals.map((interval) => interval.label),
      datasets: [
        {
          label: 'Transacciones',
          data: generateHistogramData(transactions),
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
        },
      ],
    };
  
    const options = {
        responsive: true,
        scales: {
          x: {
            type: 'category', // Especifica que el eje X es una escala de categoría
            grid: {
              display: false,
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              drawBorder: false,
            },
          },
        },
      };
  
    return <Bar data={data} options={options} />;
  };

  export default TransactionHistogram;