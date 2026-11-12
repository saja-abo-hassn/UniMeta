"use client";

import { useState, useEffect, useCallback } from "react";
import { adminService, AdminOverviewData } from "@/src/services/admin-service";

export function useAdminOverview() {
  const [data, setData] = useState<AdminOverviewData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOverview = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminService.getOverview();
      if (res.data) {
        setData(res.data);
      } else {
        setError(res.message || "فشل جلب إحصائيات لوحة التحكم");
      }
    } catch {
      setError("حدث خطأ أثناء تحميل البيانات");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverview();

    const handleSync = () => {
      fetchOverview();
    };

    window.addEventListener("unimeta_auth_change", handleSync);
    window.addEventListener("storage", handleSync);

    return () => {
      window.removeEventListener("unimeta_auth_change", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, [fetchOverview]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchOverview,
  };
}

