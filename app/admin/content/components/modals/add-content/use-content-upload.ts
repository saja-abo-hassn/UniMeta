"use client";

import { useState, useCallback } from "react";
import { ContentUploadState } from "./types";
import { ALLOWED_EXTENSIONS, MAX_FILE_SIZE_MB } from "../../../types";
import { API_CONFIG } from "@/src/services/api-client";
import { libraryFileTypes, libraryMaxFileMb } from "@/src/services/library-service";

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
    const allowed = API_CONFIG.useMock ? ALLOWED_EXTENSIONS : libraryFileTypes;
    const maxSize = API_CONFIG.useMock ? MAX_FILE_SIZE_MB : libraryMaxFileMb;
    if (!allowed.includes(ext)) {
      setUploadState((prev) => ({
        ...prev,
        error: "نوع الملف غير مدعوم. الصيغ المدعومة " + allowed.join(", "),
      }));
      return false;
    }

    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > maxSize) {
      setUploadState((prev) => ({
        ...prev,
        error: `حجم الملف (${sizeMB.toFixed(1)}MB) يتجاوز الحد الأقصى المسموح به وهو ${maxSize}MB`,
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
      progress: 100,
      isUploading: false,
      error: undefined,
    });

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

