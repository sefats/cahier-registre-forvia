import React, { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const VisitorMemberComparisonChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null); // Référence pour stocker l'instance du graphique

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    // Détruire l'instance de graphique existante si elle existe
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Créer une nouvelle instance de Chart et stocker la référence
    chartInstanceRef.current = new Chart(ctx, {
      type: "doughnut",
      data: data,
      options: {
        responsive: true,
      },
    });
  }, [data]);

  return <canvas ref={chartRef}></canvas>;
};

export default VisitorMemberComparisonChart;
