"use client";

import { Upload } from "lucide-react";
import { useCallback } from "react";
import styles from "./FileUpload.module.css";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
}

export const FileUpload = ({ onFileSelect, selectedFile }: FileUploadProps) => {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (!file) return;

      const validTypes = ["audio/mpeg", "audio/wav"];
      if (!validTypes.includes(file.type)) {
        alert("Only .mp3 or .wav files are allowed!");
        return;
      }

      onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];

      if (file && (file.type === "audio/mpeg" || file.type === "audio/wav")) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.heading}>Upload Call Recording</h2>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={styles.uploadContainer}>
        <input
          type="file"
          id="audio-upload"
          className={styles.hiddenInput}
          accept=".mp3,.wav"
          onChange={handleFileInput}
        />

        <label htmlFor="audio-upload" className={styles.label}>
          <Upload className={styles.icon} />
          {selectedFile ? (
            <div>
              <p className={styles.fileName}>{selectedFile.name}</p>
              <p className={styles.subText}>Click or drag to replace</p>
            </div>
          ) : (
            <div>
              <p className={styles.fileName}>Drop your audio file here</p>
              <p className={styles.subText}>or click to browse (.mp3, .wav)</p>
            </div>
          )}
        </label>
      </div>
    </div>
  );
};
