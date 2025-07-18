import React, { useState, useRef } from "react";
import FileUpload from "../components/FileUpload";
import NutritionSummary from "../components/NutritionSummary";
import ChatbotOverlay from "../components/ChatbotOverlay";
import { MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [showChatbot, setShowChatbot] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleFileSelected = async (file: File) => {
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
      const response = await fetch("http://127.0.0.1:8000/process-image", {
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
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === "AbortError") {
        console.log("Fetch aborted");
        return;
      }
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      setResult({
        nutrients: null,
        analysis: null,
        isLoading: false,
        error: errorMessage,
      });
    }
  };

  const handleReset = () => {
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
    <div className="container mx-auto px-4 py-8 relative">
      <section className="max-w-4xl mx-auto mb-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Nutrition Scanner
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Upload a nutrition label image and our AI will extract the details and analyze the nutritional content for you.
          </p>
        </div>

        <FileUpload
          onFileSelected={handleFileSelected}
          isProcessing={result.isLoading}
          onReset={handleReset}
        />
      </section>

      {(result.nutrients || result.analysis || result.isLoading) && (
        <section key={resetCounter} className="max-w-4xl mx-auto mt-8">
          <NutritionSummary
            nutrients={result.nutrients}
            analysis={result.analysis}
            isLoading={result.isLoading}
          />
        </section>
      )}

      {/* Floating Chatbot Button with Animation */}
      <AnimatePresence>
        {!showChatbot && (
          <motion.button
            onClick={() => setShowChatbot(true)}
            className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            aria-label="Open Chatbot"
          >
            <MessageCircle size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showChatbot && (
          <ChatbotOverlay onClose={() => setShowChatbot(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;