"use client";

import { useState } from "react";
import { useNotifications } from "@/src/contexts/notifications-context";
import { useStudentUser } from "@/src/hooks/use-student-user";
import { useStudyPlan } from "@/src/contexts/study-plan-context";
import { DeviceItem } from "../types";
import { initialDevices } from "../data/initial-devices";
import { apiClient } from "@/src/services/api-client";
import { isPalestinianMobile } from "@/src/lib/palestinian-phone";

export function useExchangeDevices() {
  const { notify } = useNotifications();
  const { fullName } = useStudentUser();
  const { selectedPlan, hasPlanSelected } = useStudyPlan();

  const currentStudentName = fullName || "طالب UniMeta";
  const currentStudentMajor = hasPlanSelected ? selectedPlan.major : "تكنولوجيا المعلومات";

  const [devices, setDevices] = useState<DeviceItem[]>(initialDevices);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const [requestingDevice, setRequestingDevice] = useState<DeviceItem | null>(null);
  const [durationDays] = useState(7);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState("");
  const [newDeviceCategory, setNewDeviceCategory] = useState<DeviceItem["category"]>("متحكمات ومستشعرات");
  const [newDeviceType, setNewDeviceType] = useState<DeviceItem["type"]>("إعارة مجانية");
  const [newFeeText, setNewFeeText] = useState("مجاناً للطلاب");
  const [contactPhone, setContactPhone] = useState("");
  const [contactPhoneError, setContactPhoneError] = useState("");

  const filteredDevices = devices.filter((d) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      d.name.toLowerCase().includes(q) ||
      d.model.toLowerCase().includes(q) ||
      d.owner.toLowerCase().includes(q);

    const matchesCategory = categoryFilter === "all" || d.category === categoryFilter;
    const matchesType = typeFilter === "all" || d.type === typeFilter;

    return matchesSearch && matchesCategory && matchesType;
  });

  const handleAddDeviceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiClient.isUsingMock()) return;
    if (!newDeviceName.trim()) return;
    if (!isPalestinianMobile(contactPhone)) {
      setContactPhoneError("أدخل رقم جوال فلسطيني من 10 أرقام يبدأ بـ 059 أو 056.");
      return;
    }

    const newDevice: DeviceItem = {
      id: `dev-${Date.now()}`,
      name: newDeviceName,
      category: newDeviceCategory,
      model: "Custom Tool",
      owner: currentStudentName,
      ownerMajor: currentStudentMajor,
      contactPhone,
      condition: "ممتازة",
      type: newDeviceType,
      feeText: newFeeText || "مجاناً",
      deposit: "حسب الاتفاق",
      status: "متاح فوراً",
      description: "تمت إضافة الجهاز للمنصة لمساعدة الطلاب في التجارب ومشاريع التخرج.",
    };

    setDevices([newDevice, ...devices]);

    notify({
      type: "rent",
      title: "تم نشر جهازك للإعارة/الاستئجار! 🎉",
      message: `أصبح جهاز "${newDeviceName}" متاحاً الآن في مكتبة الأجهزة لباقي زملائك.`,
      link: "/student/exchange/devices",
      playSound: true,
      browserNotify: true,
    });

    setIsAddModalOpen(false);
    setNewDeviceName("");
    setContactPhone("");
    setContactPhoneError("");
  };

  return {
    devices,
    filteredDevices,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    typeFilter,
    setTypeFilter,
    requestingDevice,
    setRequestingDevice,
    durationDays,
    isAddModalOpen,
    setIsAddModalOpen,
    newDeviceName,
    setNewDeviceName,
    newDeviceCategory,
    setNewDeviceCategory,
    newDeviceType,
    setNewDeviceType,
    newFeeText,
    setNewFeeText,
    contactPhone,
    setContactPhone: (value: string) => { setContactPhone(value); setContactPhoneError(""); },
    contactPhoneError,
    currentStudentName,
    currentStudentMajor,
    handleAddDeviceSubmit,
  };
}

