import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement,Filler, LineElement, Tooltip);

const APYChart: React.FC<{apyData: any}> = ({apyData}) => {

  // const generateAPYData = () => {
  //   // alert({ticker})
  //   return ETH_APY_DATA;
  //   // for (let i = 0; i < 100; i++) {
  //   //   // Use a sine wave function combined with some random noise to simulate realistic data
  //   //   const value = 500 + 400 * Math.sin(i * 0.1) + (Math.random() - 0.5) * 100;
  //   //   // Ensure value stays within 0 and 1000
  //   //   data.push(Math.min(Math.max(0, value), 1000).toFixed(2));
  //   // }

  // };
  const createGradient = (ctx: CanvasRenderingContext2D) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(0, 0, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(0, 0, 255, 0.1)');
    return gradient;
  };
  const data = {
    labels: new Array(50).fill(''),
    datasets: [
      {
        label: '',
        data: apyData,
        borderColor: '#916CFF',
        backgroundColor: "rgb(34,21,65)",
        fillColor: "red",
        tension: 0.1,
        fill: true,
        pointRadius: 0,
        borderWidth: 1.3
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // No legend needed
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        display: false, // Hide X-axis
      },
      y: {
        display: false, // Hide Y-axis
      },
    },
  };

  return (
    <div className='h-32 cursor-pointer'>
      <Line data={data} options={options} />
    </div>
  );
};

export default APYChart;
