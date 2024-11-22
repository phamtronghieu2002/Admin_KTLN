import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { getStatistic } from "../../../../services/statisticService";

Chart.register(...registerables);

interface LessonStats {
  category: string;
  lessonCount: number;
}

const LessonByCategoryChart: React.FC = () => {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res: any = await getStatistic();
        const data = res.lessonByCategory;

        const labels = data.map((item: LessonStats) => item.category);
        const lessonCounts = data.map((item: LessonStats) => item.lessonCount);

        const maxCount = Math.max(...lessonCounts);

        setChartData({
          labels,
          datasets: [
            {
              label: "Số lượng bài học",
              data: lessonCounts,
              backgroundColor: lessonCounts.map((count:any) =>
                count === maxCount ? "#FF5722" : "#4CAF50"
              ),
              borderColor: lessonCounts.map((count:any) =>
                count === maxCount ? "#FF9800" : "#81C784"
              ),
              borderWidth: 2,
              hoverBackgroundColor: "#FFC107",
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching lesson stats:", error);
      }
    };

    fetchData();
  }, []);

  if (!chartData) return <p>Loading...</p>;

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
        labels: {
          color: "#3f51b5",
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.raw} bài học`,
        },
      },
    },
    animation: {
      duration: 1500,
      easing: "easeOutBounce",
    },
    scales: {
      x: {
        ticks: {
          color: "#3f51b5",
          font: {
            size: 12,
          },
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          color: "#3f51b5",
          font: {
            size: 12,
          },
          stepSize: 1,
        },
        grid: {
          color: "rgba(63, 81, 181, 0.2)",
        },
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "400px", padding: "20px" }}>
      <h3
        style={{
          textAlign: "center",
          color: "#3f51b5",
          fontSize: "1.5rem",
          fontWeight: "bold",
          marginBottom: "20px",
        }}
      >
        Thống kê bài học theo danh mục
      </h3>
      <Bar data={chartData} />
    </div>
  );
};

export default LessonByCategoryChart;
