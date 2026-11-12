"use client";

import { useState, useCallback } from "react";
import { ContentUploadState } from "./types";
import { ALLOWED_EXTENSIONS, MAX_FILE_SIZE_MB } from "../../../types";

const INITIAL_STATE: ContentUploadState = {
  file: null,
  fileName: "",
  fileSizeFormatted: "",
  fileSizeBytes: 0,
  fileTypeDetected: "PDF",
  progress: 0,
  isUploading: false,
};

export function useContentUpload() {
  const [uploadState, setUploadState] = useState<ContentUploadState>(INITIAL_STATE);

  const handleFile = useCallback((file: File) => {
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setUploadState((prev) => ({
        ...prev,
        error: `نوع الملف غير مدعوم (${ext}). الصيغ المدعومة: PDF, Word, PowerPoint, صور, MP4, ZIP`,
      }));
      return false;
    }

    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > MAX_FILE_SIZE_MB) {
      setUploadState((prev) => ({
        ...prev,
        error: `حجم الملف (${sizeMB.toFixed(1)}MB) يتجاوز الحد الأقصى المسموح به وهو ${MAX_FILE_SIZE_MB}MB`,
      }));
      return false;
    }

    let detected: ContentUploadState["fileTypeDetected"] = "PDF";
    if (ext === ".pdf") detected = "PDF";
    else if (ext === ".docx" || ext === ".doc") detected = "DOCX";
    else if (ext === ".pptx" || ext === ".ppt") detected = "SLIDES";
    else if (ext === ".png" || ext === ".jpg" || ext === ".jpeg") detected = "IMAGE";
    else if (ext === ".mp4") detected = "VIDEO";
    else if (ext === ".zip") detected = "ZIP";

    setUploadState({
      file,
      fileName: file.name,
      fileSizeFormatted: `${sizeMB.toFixed(1)} MB`,
      fileSizeBytes: file.size,
      fileTypeDetected: detected,
      progress: 20,
      isUploading: true,
      error: undefined,
    });

    setTimeout(() => {
      setUploadState((prev) => ({ ...prev, progress: 65 }));
    }, 180);

    setTimeout(() => {
      setUploadState((prev) => ({ ...prev, progress: 100, isUploading: false }));
    }, 420);

    return true;
  }, []);

  const removeFile = useCallback(() => {
    setUploadState(INITIAL_STATE);
  }, []);

  const resetUpload = useCallback(() => {
    setUploadState(INITIAL_STATE);
  }, []);

  return {
    uploadState,
    handleFile,
    removeFile,
    resetUpload,
  };
}

