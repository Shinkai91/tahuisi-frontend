import React from "react";
import ReactMarkdown from "react-markdown"; // Import ReactMarkdown

interface NutritionSummaryProps {
  nutrients: Record<string, string> | null;
  analysis: string | null;
  isLoading: boolean;
}

const NutritionSummary: React.FC<NutritionSummaryProps> = ({
  nutrients,
  analysis,
  isLoading,
}) => {
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

  if (!nutrients && !analysis) {
    return null;
  }

  // Handle N/A values and ensure proper units
  const processedNutrients = nutrients
    ? Object.entries(nutrients).reduce<Record<string, string>>(
        (acc, [key, value]) => {
          if (value === "N/A") {
            // Set default values based on the nutrient type
            acc[key] = key.toLowerCase().includes("garam") ? "0mg" : "0g";
          } else {
            acc[key] = value;
          }
          return acc;
        },
        {}
      )
    : null;

  return (
    <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Ringkasan Gizi
      </h3>

      {processedNutrients && (
        <div className="mb-6">
          <h4 className="text-base font-medium text-gray-900 dark:text-white mb-2">
            Nutrisi:
          </h4>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
            {Object.entries(processedNutrients).map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong> {value}
              </li>
            ))}
          </ul>
        </div>
      )}

      {analysis && (
        <div>
          <h4 className="text-base font-medium text-gray-900 dark:text-white mb-2">
            Analisis:
          </h4>
          <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
            <ReactMarkdown>{analysis}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default NutritionSummary;