"use client";
import { apiClient } from "@/src/services/api-client";
import { LiveMarketplace } from "@/components/integration/live-marketplace";

import dynamic from "next/dynamic";
import { useExchangeDevices } from "./hooks/use-exchange-devices";
import { DevicesHeader } from "./components/devices-header";
import { DevicesKPIs } from "./components/devices-kpis";
import { DevicesFilterBar } from "./components/devices-filter-bar";
import { DevicesGrid } from "./components/devices-grid";

export type { DeviceItem } from "./types";

const DynamicTwoStepExchangeModal = dynamic(
  () =>
    import("@/components/student/exchange/two-step-exchange-modal").then(
      (mod) => mod.TwoStepExchangeModal
    ),
  { ssr: false }
);

const DynamicAddDeviceModal = dynamic(
  () => import("./components/add-device-modal").then((mod) => mod.AddDeviceModal),
  { ssr: false }
);

export default function DeviceExchangePage() { return apiClient.isUsingMock() ? <MockDeviceExchangePage/> : <LiveMarketplace kind="DEVICE"/>; }
function MockDeviceExchangePage() {
  const {
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
    currentStudentName,
    currentStudentMajor,
    handleAddDeviceSubmit,
  } = useExchangeDevices();

  return (
    <div className="space-y-6 animate-fade-in" dir="rtl">
      <DevicesHeader onOpenAddModal={() => setIsAddModalOpen(true)} />

      <DevicesKPIs devices={devices} />

      <DevicesFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
      />

      <DevicesGrid
        filteredDevices={filteredDevices}
        onRequestDevice={(dev) => setRequestingDevice(dev)}
      />

      {requestingDevice && (
        <DynamicTwoStepExchangeModal
          isOpen={!!requestingDevice}
          onClose={() => setRequestingDevice(null)}
          item={{
            id: requestingDevice.id,
            title: requestingDevice.name,
            category: "أجهزة",
            ownerName: requestingDevice.owner,
            ownerMajor: requestingDevice.ownerMajor,
            depositAmount: parseInt(requestingDevice.deposit.replace(/\D/g, ""), 10) || 20,
            dailyRate: requestingDevice.feeText.includes("₪")
              ? parseInt(requestingDevice.feeText.replace(/\D/g, ""), 10) || 2
              : 0,
            durationDays,
            durationText: `${durationDays} أيام (قابلة للتجديد)`,
          }}
          currentStudent={{
            name: currentStudentName,
            studentId: currentStudentName.includes("ريم") ? "20221084" : undefined,
            major: currentStudentMajor,
          }}
        />
      )}

      {isAddModalOpen && (
        <DynamicAddDeviceModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          newDeviceName={newDeviceName}
          setNewDeviceName={setNewDeviceName}
          newDeviceCategory={newDeviceCategory}
          setNewDeviceCategory={setNewDeviceCategory}
          newDeviceType={newDeviceType}
          setNewDeviceType={setNewDeviceType}
          newFeeText={newFeeText}
          setNewFeeText={setNewFeeText}
          onSubmit={handleAddDeviceSubmit}
        />
      )}
    </div>
  );
}
