import React from 'react';

interface MacroChartProps {
  carbs: number;
  protein: number;
  fat: number;
}

const MacroChart: React.FC<MacroChartProps> = ({ carbs, protein, fat }) => {
  const total = carbs + protein + fat;
  const carbsPercentage = Math.round((carbs / total) * 100);
  const proteinPercentage = Math.round((protein / total) * 100);
  const fatPercentage = Math.round((fat / total) * 100);

  return (
    <div className="flex flex-col space-y-4">
      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Macronutrient Distribution</h4>

      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex">
        <div 
          className="h-full bg-blue-500 transition-all duration-500 ease-out" 
          style={{ width: `${carbsPercentage}%` }}
        ></div>
        <div 
          className="h-full bg-red-500 transition-all duration-500 ease-out" 
          style={{ width: `${fatPercentage}%` }}
        ></div>
        <div 
          className="h-full bg-green-500 transition-all duration-500 ease-out" 
          style={{ width: `${proteinPercentage}%` }}
        ></div>
      </div>

      <div className="flex justify-between text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
          <span className="text-gray-700 dark:text-gray-300">Carbs: {carbsPercentage}%</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
          <span className="text-gray-700 dark:text-gray-300">Fat: {fatPercentage}%</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span className="text-gray-700 dark:text-gray-300">Protein: {proteinPercentage}%</span>
        </div>
      </div>
    </div>
  );
};

export default MacroChart;