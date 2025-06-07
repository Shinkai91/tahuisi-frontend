import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

interface OCRResultsProps {
  nutrients: Record<string, string> | null;
  isLoading: boolean;
}

const OCRResults: React.FC<OCRResultsProps> = ({ nutrients, isLoading }) => {
  if (isLoading) {
    return (
      <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800">
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!nutrients || Object.keys(nutrients).length === 0) {
    return (
      <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800">
        <p className="text-gray-700 dark:text-gray-300">
          Tidak ada data nutrisi yang tersedia.
        </p>
      </div>
    );
  }

  const processedNutrients = Object.entries(nutrients).map(([key, value]) => {
    let numericValue = parseFloat(value.replace(/[^\d.-]/g, ""));
    if (isNaN(numericValue)) {
      numericValue = 0; // Replace invalid values with 0
    }

    return {
      key,
      value: `${numericValue}${
        value.toLowerCase().includes("mg") ? "mg" : "g"
      }`, // Pastikan tidak double
    };
  });

  // Define colors for each nutrient
  const nutrientColors: Record<string, string> = {
    "Lemak Total": "rgba(255, 99, 132, 0.5)", // Merah
    Protein: "rgba(75, 192, 192, 0.5)", // Hijau
    Gula: "rgba(255, 206, 86, 0.5)", // Kuning
    Garam: "rgba(54, 162, 235, 0.5)", // Biru
  };

  const nutrientBorderColors: Record<string, string> = {
    "Lemak Total": "rgba(255, 99, 132, 1)", // Merah
    Protein: "rgba(75, 192, 192, 1)", // Hijau
    Gula: "rgba(255, 206, 86, 1)", // Kuning
    Garam: "rgba(54, 162, 235, 1)", // Biru
  };

  return (
    <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Visualisasi Kandungan Gizi
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {processedNutrients.map(({ key, value }) => {
          const data = {
            labels: [key],
            datasets: [
              {
                data: [100], // Grafik penuh dengan satu warna
                backgroundColor: [
                  nutrientColors[key] || "rgba(200, 200, 200, 0.5)",
                ],
                borderColor: [
                  nutrientBorderColors[key] || "rgba(200, 200, 200, 1)",
                ],
                borderWidth: 1,
              },
            ],
          };

          const options = {
            responsive: true,
            cutout: "70%", // Membuat bagian tengah kosong
            plugins: {
              tooltip: {
                callbacks: {
                  label: function () {
                    return `${key}: ${value}`;
                  },
                },
              },
            },
          };

          return (
            <div key={key} className="relative">
              <Doughnut data={data} options={options} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-900 dark:text-white flex items-center justify-center">
                  {value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OCRResults;