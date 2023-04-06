import React, { useState, useEffect, useRef } from "react";
import {Chart} from "chart.js";

const DonutChart = ({ data }) => {
  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);

  useEffect(() => {
    if (chartInstance) {
      chartInstance.destroy();
    }

    if (chartRef && chartRef.current) {
      const myChartRef = chartRef.current.getContext("2d");

      const newChartInstance = new Chart(myChartRef, {
        type: "doughnut",
        data: {
          labels: ["Defined Voters", "Open Voters"],
          datasets: [
            {
              data: [data?.PredefinedElections, data?.openElections],
              backgroundColor: ["#0074D9", "#FF4136"],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            display: true,
            position: "bottom",
          },
        },
      });

      setChartInstance(newChartInstance);
    }
  }, [data]);

  return <canvas ref={chartRef} />;
};

export default DonutChart;
