"use client";

import { useState } from "react";
import style from "./page.module.css";
import { FileUpload } from "./components/FileUpload/FileUpload";
import Header from "./components/Header/Header";
import { AudioPlayer } from "./components/AudioPlayer/AudioPlayer";
import { Loader2 } from "lucide-react";
import FeedbackReport from "./components/FeedbackReport/FeedbackReport";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);



  const handleProcessCall = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setResult(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch("/api/analyze-call", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      setResult(data); 
    } catch (err: any) {
      console.error("Error calling API:", err);
      setError(err.message || "Failed to process call");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={style.topContainer}>
      <Header />

      <div className={style.contentContainer}>
        <FileUpload
          onFileSelect={setSelectedFile}
          selectedFile={selectedFile}
        />

        {selectedFile && <AudioPlayer file={selectedFile} />}
      </div>

      {selectedFile && (
        <div className={style.processButtonContainer}>
          <button
            onClick={handleProcessCall}
            className={style.processButton}
            disabled={isProcessing}>
            {isProcessing ? (
              <>
                <Loader2 className={style.loader} />
                Processing...
              </>
            ) : (
              "Process Call"
            )}
          </button>
        </div>
      )}

      {isProcessing && <p style={{ marginTop: "1rem" }}>Processing audio...</p>}

      {error && (
        <p style={{ marginTop: "1rem", color: "red" }}>Error: {error}</p>
      )}

      {result && <FeedbackReport feedback={result} />}
    
    </div>
  );
}
