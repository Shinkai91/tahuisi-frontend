import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeFormat from "rehype-format";
import rehypeSanitize from "rehype-sanitize";
import rehypeRaw from "rehype-raw";
import { ActivitySquare, FileText, Info, Copy, Check } from "lucide-react";

interface NutritionSummaryProps {
  nutrients: Record<string, string> | null;
  analysis: string | null;
  isLoading: boolean;
  isDarkMode?: boolean;
}

const NutritionSummary: React.FC<NutritionSummaryProps> = ({
  nutrients,
  analysis,
  isLoading,
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyText = async () => {
    if (analysis) {
      try {
        await navigator.clipboard.writeText(analysis);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600 dark:text-gray-400">Menganalisis...</span>
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
    <div className="space-y-6">
      {/* First Row: Informasi Gizi (A) and Ringkasan Gizi (B) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Container A - Informasi Gizi */}
        <div className="relative bg-gradient-to-br from-white via-green-50/30 to-blue-50/30 dark:from-gray-800 dark:via-gray-800/50 dark:to-gray-900 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 backdrop-blur-sm overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-green-400/10 to-blue-400/10 rounded-full -translate-y-20 -translate-x-20"></div>
          <div className="absolute bottom-0 right-0 w-28 h-28 bg-gradient-to-tl from-blue-400/10 to-indigo-400/10 rounded-full translate-y-14 translate-x-14"></div>

          {/* Header */}
          <div className="relative flex items-center mb-8">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-green-500 via-blue-500 to-indigo-500 rounded-xl blur-sm opacity-60 animate-pulse"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-xl p-3 shadow-lg">
                <ActivitySquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 via-green-700 to-blue-800 dark:from-white dark:via-green-200 dark:to-blue-200 bg-clip-text text-transparent">
                Informasi Gizi
              </h3>
              <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mt-1"></div>
            </div>
          </div>

          {processedNutrients && (
            <div className="relative space-y-6">
              <h4 className="font-bold text-lg text-gray-700 dark:text-gray-300 mb-4 flex items-center">
                <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mr-3"></div>
                Nilai Nutrisi:
              </h4>
              <ul className="space-y-3">
                {Object.entries(processedNutrients).map(([key, value], index) => (
                  <li
                    key={key}
                    className="group relative flex justify-between items-center text-sm bg-gradient-to-r from-white to-gray-50/50 dark:from-gray-700 dark:to-gray-800/50 rounded-xl px-6 py-4 shadow-md border border-gray-200/50 dark:border-gray-600/50 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] overflow-hidden"
                    style={{
                      animationDelay: `${index * 50}ms`
                    }}
                  >
                    {/* Background shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-gray-600/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                    {/* Left side accent */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-green-500 to-blue-500 group-hover:w-2 transition-all duration-300"></div>

                    {/* Content */}
                    <div className="relative flex justify-between items-center w-full">
                      <span className="font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-full mr-3 group-hover:scale-150 transition-transform duration-300"></div>
                        {key}
                      </span>
                      <span className="font-bold text-gray-800 dark:text-white bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent group-hover:from-green-600 group-hover:to-blue-600 transition-all duration-300">
                        {value}
                      </span>
                    </div>

                    {/* Right side indicator */}
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-transparent via-blue-400/50 to-transparent group-hover:h-8 transition-all duration-300"></div>

                    {/* Bottom highlight */}
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent group-hover:h-0.5 group-hover:via-blue-400/60 transition-all duration-300"></div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Container B - Ringkasan Gizi */}
        <div className="relative bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-gray-800 dark:via-gray-800/50 dark:to-gray-900 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 backdrop-blur-sm overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-400/10 to-pink-400/10 rounded-full translate-y-12 -translate-x-12"></div>

          {/* Header */}
          <div className="relative flex items-center mb-8">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-full blur-sm opacity-75 animate-pulse"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg">
                <Info className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                Ringkasan Gizi
              </h3>
              <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-1"></div>
            </div>
          </div>

          {processedNutrients && (
            <div className="relative space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {Object.entries(processedNutrients).slice(0, 4).map(([key, value], index) => {
                  let gradientClass = "from-blue-500 via-blue-600 to-blue-700";
                  let shadowClass = "shadow-blue-500/30";
                  let glowClass = "hover:shadow-blue-500/50";
                  let borderClass = "border-blue-400/20";

                  if (key.toLowerCase().includes("protein")) {
                    gradientClass = "from-purple-500 via-purple-600 to-purple-700";
                    shadowClass = "shadow-purple-500/30";
                    glowClass = "hover:shadow-purple-500/50";
                    borderClass = "border-purple-400/20";
                  } else if (key.toLowerCase().includes("gula")) {
                    gradientClass = "from-orange-500 via-orange-600 to-orange-700";
                    shadowClass = "shadow-orange-500/30";
                    glowClass = "hover:shadow-orange-500/50";
                    borderClass = "border-orange-400/20";
                  } else if (key.toLowerCase().includes("lemak")) {
                    gradientClass = "from-red-500 via-red-600 to-red-700";
                    shadowClass = "shadow-red-500/30";
                    glowClass = "hover:shadow-red-500/50";
                    borderClass = "border-red-400/20";
                  } else if (key.toLowerCase().includes("garam")) {
                    gradientClass = "from-gray-500 via-gray-600 to-gray-700";
                    shadowClass = "shadow-gray-500/30";
                    glowClass = "hover:shadow-gray-500/50";
                    borderClass = "border-gray-400/20";
                  }

                  return (
                    <div
                      key={key}
                      className={`relative group bg-gradient-to-br ${gradientClass} text-white rounded-2xl p-6 text-center shadow-xl ${shadowClass} border ${borderClass} transform hover:scale-105 transition-all duration-500 ${glowClass} hover:shadow-2xl overflow-hidden`}
                      style={{
                        animationDelay: `${index * 100}ms`
                      }}
                    >
                      {/* Animated background patterns */}
                      <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-white rounded-full -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform duration-500"></div>
                        <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/70 rounded-full translate-y-6 -translate-x-6 group-hover:scale-125 transition-transform duration-700"></div>
                        <div className="absolute top-1/2 left-1/2 w-8 h-8 bg-white/50 rounded-full -translate-x-4 -translate-y-4 group-hover:rotate-180 transition-transform duration-1000"></div>
                      </div>

                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 skew-x-12"></div>

                      {/* Content */}
                      <div className="relative z-10">
                        <div className="text-sm font-semibold opacity-90 mb-3 tracking-wider uppercase letterspacing">
                          {key}
                        </div>
                        <div className="font-black text-4xl mb-2 drop-shadow-lg tracking-tight">
                          {value}
                        </div>
                        <div className="text-xs opacity-80 font-medium tracking-wider uppercase">
                          per sajian
                        </div>
                      </div>

                      {/* Bottom border accent */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-white/20 via-white/40 to-white/20 group-hover:h-2 transition-all duration-300"></div>

                      {/* Corner decorations */}
                      <div className="absolute top-2 right-2 w-2 h-2 bg-white/30 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                      <div className="absolute bottom-2 left-2 w-1 h-1 bg-white/40 rounded-full group-hover:scale-200 transition-transform duration-300"></div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Second Row: Container C - Analysis */}
      {analysis && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg border border-blue-100 dark:border-gray-700 overflow-hidden">
          {/* Header Section */}
          <div className="bg-white dark:bg-gray-800 border-b border-blue-100 dark:border-gray-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                    Analisis Nutrisi
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Evaluasi mendalam tentang kandungan gizi produk
                  </p>
                </div>
              </div>

              {/* Copy Button */}
              <button
                onClick={handleCopyText}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
                title={isCopied ? "Teks telah disalin!" : "Salin teks analisis"}
              >
                {isCopied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span className="text-sm font-medium">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span className="text-sm font-medium">Salin</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Content Section */}
          <div className="px-6 py-4 prose dark:prose-invert max-w-none">
            <ReactMarkdown
              rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeFormat]}
              components={{
                h1: (props) => <h1 className="text-2xl font-bold mb-4" {...props} />,
                h2: (props) => <h2 className="text-xl font-semibold mb-3" {...props} />,
                h3: (props) => <h3 className="text-lg font-medium mb-2" {...props} />,
                p: (props) => <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed" {...props} />,
                ul: (props) => <ul className="list-disc pl-5 mb-4 space-y-2" {...props} />,
                ol: (props) => <ol className="list-decimal pl-5 mb-4 space-y-2" {...props} />,
                li: (props) => <li className="text-gray-600 dark:text-gray-400" {...props} />,
                strong: (props) => <strong className="font-semibold text-gray-900 dark:text-white" {...props} />,
                blockquote: (props) => (
                  <blockquote className="border-l-4 border-gray-200 dark:border-gray-700 pl-4 italic my-4" {...props} />
                ),
              }}
            >
              {analysis}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default NutritionSummary;