"use client";
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

export default function DeviceExchangePage() { return <MockDeviceExchangePage/>; }
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
    contactPhone,
    setContactPhone,
    contactPhoneError,
    currentStudentName,
    currentStudentMajor,
    handleAddDeviceSubmit,
    mock,
    busy,
    requestDevice,
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
        categories={mock ? undefined : [...new Set(devices.map((device) => device.category))]}
      />

      <DevicesGrid
        filteredDevices={filteredDevices}
        onRequestDevice={requestDevice}
        busy={busy}
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
            ownerPhone: requestingDevice.contactPhone,
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
          onClose={() => { if (!busy) setIsAddModalOpen(false); }}
          newDeviceName={newDeviceName}
          setNewDeviceName={setNewDeviceName}
          newDeviceCategory={newDeviceCategory}
          setNewDeviceCategory={setNewDeviceCategory}
          newDeviceType={newDeviceType}
          setNewDeviceType={setNewDeviceType}
          newFeeText={newFeeText}
          setNewFeeText={setNewFeeText}
          contactPhone={contactPhone}
          setContactPhone={setContactPhone}
          contactPhoneError={contactPhoneError}
          mock={mock}
          isSaving={busy}
          onSubmit={handleAddDeviceSubmit}
        />
      )}
    </div>
  );
}
