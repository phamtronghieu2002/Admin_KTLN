import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { getStatistic } from "../../../../services/statisticService";

Chart.register(...registerables);

interface UserStats {
  month: string; // Tháng hiển thị
  userCount: number; // Số lượng người dùng
}

// Xử lý dữ liệu từ API
const processData = (data: { _id: string; userCount: number }[]): UserStats[] => {
  const processedData = data.map((item) => {
    const [year, month] = item._id.split("-");
    return {
      month: `Tháng ${parseInt(month)}`,
      userCount: item.userCount,
    };
  });

  // Đảm bảo đầy đủ 12 tháng
  const months = Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`);
  const filledData = months.map((month) => {
    const existing = processedData.find((item) => item.month === month);
    return existing || { month, userCount: 0 };
  });

  return filledData;
};

const ActivedMonthChart: React.FC = () => {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res: any = await getStatistic();
        const processedData = processData(res.usersMonth);

        const labels = processedData.map((item) => item.month);
        const data = processedData.map((item) => item.userCount);

        setChartData({
          labels,
          datasets: [
            {
              label: "Số lượng người dùng",
              data,
              backgroundColor: "rgba(63, 81, 181, 0.3)",
              borderColor: "rgba(63, 81, 181, 1)",
              pointBackgroundColor: "rgba(255, 64, 129, 1)",
              pointBorderColor: "#fff",
              borderWidth: 3,
              tension: 0.4, // Bo cong biểu đồ
              pointHoverBackgroundColor: "rgba(255, 64, 129, 1)",
              pointHoverBorderColor: "rgba(63, 81, 181, 1)",
              pointRadius: 6,
              pointHoverRadius: 10,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching user stats:", error);
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
        enabled: true,
        backgroundColor: "rgba(63, 81, 181, 0.9)",
        titleFont: { size: 14, weight: "bold" },
        bodyFont: { size: 12 },
        callbacks: {
          label: (tooltipItem: any) =>
            ` ${tooltipItem.raw} người dùng trong tháng`,
        },
      },
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
          stepSize: 10,
        },
        grid: {
          color: "rgba(63, 81, 181, 0.2)",
        },
      },
    },
  };

  return (
    <div
      style={{
        width: "100%",
        height: "400px",
        padding: "20px",
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h3
        style={{
          textAlign: "center",
          fontWeight: "bold",
          color: "#3f51b5",
          marginBottom: "20px",
        }}
      >
        Thống kê số lượng người dùng theo tháng
      </h3>
      <Line data={chartData}  />
    </div>
  );
};

export default ActivedMonthChart;
