import React, { useState, useRef } from "react";
import { Upload, Camera, ImageIcon, RotateCw } from "lucide-react";

interface FileUploadProps {
  onFileSelected: (file: File) => void;
  isProcessing: boolean;
  onReset: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelected, isProcessing, onReset }) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showCameraOverlay, setShowCameraOverlay] = useState(false);
  const [showResetIcon, setShowResetIcon] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.match("image.*")) {
      alert("Mohon pilih file gambar");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onFileSelected(file);
    setShowResetIcon(true);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const startCamera = async () => {
    setShowCameraOverlay(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (error) {
      console.error("Kamera gagal dibuka:", error);
      alert("Kamera tidak tersedia pada perangkat ini.");
      setShowCameraOverlay(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setShowCameraOverlay(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    if (context) {
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "photo.jpg", { type: "image/jpeg" });
          handleFile(file);
          onFileSelected(file); // ✅ langsung kirim
        }
      }, "image/jpeg");
    }

    stopCamera();
  };

  const resetUpload = () => {
    setPreviewUrl(null);
    setShowResetIcon(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    stopCamera();
    onReset();
  };

  return (
    <div className="relative w-full max-w-xl mx-auto">
      {/* Camera Overlay */}
      {showCameraOverlay && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-[9999] flex flex-col items-center justify-center px-4">
          <video
            ref={videoRef}
            className="w-full max-w-lg object-contain rounded-xl border border-gray-300 mb-4"
            autoPlay
            playsInline
          />
          <div className="flex gap-4">
            <button
              onClick={capturePhoto}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Ambil Foto
            </button>
            <button
              onClick={stopCamera}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Tutup Kamera
            </button>
          </div>
        </div>
      )}

      {/* Upload Area */}
      {!previewUrl ? (
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 transition-colors ${dragActive
              ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
              : "border-gray-300 dark:border-gray-700 hover:border-emerald-400 dark:hover:border-emerald-600"
            }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
          <div className="flex flex-col items-center justify-center space-y-4 py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-2">
              <ImageIcon className="w-8 h-8 text-emerald-600 dark:text-emerald-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Unggah Label Gizi
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-xs">
              Seret dan lepas file gambar, atau klik untuk memilih
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <button
                type="button"
                onClick={triggerFileInput}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>Unggah Gambar</span>
              </button>
              <button
                type="button"
                onClick={startCamera}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Camera className="w-4 h-4" />
                <span>Ambil Foto</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative rounded-xl overflow-hidden border border-gray-300 dark:border-gray-700">
          <img
            src={previewUrl ?? undefined}
            alt="Pratinjau"
            className="w-full object-contain max-h-[400px]"
          />
          {showResetIcon && (
            <button
              onClick={resetUpload}
              className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 text-white p-2 rounded-full hover:bg-opacity-90 transition"
              title="Reset"
            >
              <RotateCw className="w-5 h-5" />
            </button>
          )}
          {isProcessing && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm font-medium">Memproses gambar...</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;