import React, { useState, useRef } from "react";
import FileUpload from "../components/FileUpload";
import NutritionSummary from "../components/NutritionSummary";
import OCRResults from "../components/OCRResults";

type OCRResult = {
  nutrients: Record<string, string> | null;
  analysis: string | null;
  isLoading: boolean;
  error: string | null;
};

const Home: React.FC = () => {
  const [result, setResult] = useState<OCRResult>({
    nutrients: null,
    analysis: null,
    isLoading: false,
    error: null,
  });

  const [resetCounter, setResetCounter] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleFileSelected = async (file: File) => {
    // Abort previous request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setResult({
      nutrients: null,
      analysis: null,
      isLoading: true,
      error: null,
    });

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("https://34.30.181.73/process-image", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error("Failed to process the image");
      }

      const data = await response.json();
      setResult({
        nutrients: data.nutrients || null,
        analysis: data.analysis || null,
        isLoading: false,
        error: null,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.name === "AbortError") {
        // Fetch was aborted, don't update state
        console.log("Fetch aborted");
        return;
      }
      setResult({
        nutrients: null,
        analysis: null,
        isLoading: false,
        error: error.message,
      });
    }
  };

  const handleReset = () => {
    // Abort ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    setResult({
      nutrients: null,
      analysis: null,
      isLoading: false,
      error: null,
    });

    setResetCounter((prev) => prev + 1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="max-w-4xl mx-auto mb-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Pemindai Informasi Gizi
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Unggah gambar label gizi dan kami akan mengekstrak informasinya
            untuk Anda. AI kami akan menganalisis label dan memberikan rincian
            lengkap kandungan gizinya.
          </p>
        </div>

        <FileUpload
          onFileSelected={handleFileSelected}
          isProcessing={result.isLoading}
          onReset={handleReset}
        />
      </section>

      {(result.nutrients || result.analysis || result.isLoading) && (
        <section
          key={resetCounter}
          className="max-w-4xl mx-auto mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <NutritionSummary
            nutrients={result.nutrients}
            analysis={result.analysis}
            isLoading={result.isLoading}
          />
          <OCRResults
            nutrients={result.nutrients}
            isLoading={result.isLoading}
          />
        </section>
      )}
    </div>
  );
};

export default Home;
