"use client";

import { useState, useEffect, useCallback } from "react";
import { adminService, AdminMeData } from "@/src/services/admin-service";

export function useAdminMe() {
  const [data, setData] = useState<AdminMeData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMe = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminService.getMe();
      if (res.data) {
        setData(res.data);
      } else {
        setError(res.message || "فشل جلب بيانات المسؤول");
      }
    } catch {
      setError("حدث خطأ أثناء الاتصال بالخادم");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMe();

    const handleAuthChange = () => {
      fetchMe();
    };

    window.addEventListener("unimeta_auth_change", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("unimeta_auth_change", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, [fetchMe]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchMe,
  };
}

