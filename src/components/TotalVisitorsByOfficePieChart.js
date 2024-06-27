import React, { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const TotalVisitorsByOfficePieChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: "pie",
      data: data,
      options: {
        responsive: true,
      },
    });
  }, [data]);

  return <canvas ref={chartRef}></canvas>;
};

export default TotalVisitorsByOfficePieChart;
