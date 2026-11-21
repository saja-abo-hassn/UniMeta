"use client";

import { useState } from "react";
import { useNotifications } from "@/src/contexts/notifications-context";
import { useStudentUser } from "@/src/hooks/use-student-user";
import { useStudyPlan } from "@/src/contexts/study-plan-context";
import { DeviceItem } from "../types";
import { initialDevices } from "../data/initial-devices";
import { conditionLabels, marketplaceService, type OfferType } from "@/src/services/marketplace-service";
import { useMarketplace } from "../../use-marketplace";
import { isPalestinianMobile } from "@/src/lib/palestinian-phone";

export function useExchangeDevices() {
  const { notify } = useNotifications();
  const { fullName, user } = useStudentUser();
  const market = useMarketplace("DEVICE");
  const { selectedPlan, hasPlanSelected } = useStudyPlan();

  const currentStudentName = fullName || "طالب UniMeta";
  const currentStudentMajor = hasPlanSelected ? selectedPlan.major : "تكنولوجيا المعلومات";

  const [mockDevices, setDevices] = useState<DeviceItem[]>(initialDevices);
  const deviceTypes: Record<OfferType, DeviceItem["type"]> = {
    LOAN: "إعارة مجانية", SALE: "بيع", RENTAL: "استئجار رمزي",
    TEMPORARY_EXCHANGE: "تبادل بأداة أخرى", PERMANENT_EXCHANGE: "تبادل بأداة أخرى",
  };
  const devices: DeviceItem[] = market.mock ? mockDevices : market.offers.map((offer) => {
    const money = new Intl.NumberFormat("ar", { style: "currency", currency: offer.currency ?? "ILS" });
    return {
      id: String(offer.id),
      name: offer.title,
      category: offer.item_details?.category || "—",
      model: offer.item_details?.model || "",
      owner: offer.owner.full_name,
      ownerMajor: "",
      ownOffer: String(offer.owner.id) === user?.id,
      condition: conditionLabels[offer.item_condition],
      type: deviceTypes[offer.offer_type],
      feeText: offer.price != null
        ? money.format(Number(offer.price)) + (offer.duration_days ? " / " + offer.duration_days + " يوم" : "")
        : offer.item_details?.exchange_target || (offer.offer_type === "LOAN" ? "مجاناً" : "—"),
      deposit: offer.deposit != null ? money.format(Number(offer.deposit)) : "—",
      status: "متاح فوراً",
      description: offer.description,
    };
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const [requestingDevice, setRequestingDevice] = useState<DeviceItem | null>(null);
  const [durationDays] = useState(7);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState("");
  const [newDeviceCategory, setNewDeviceCategory] = useState<DeviceItem["category"]>("لوحات إلكترونية ومتحكمات");
  const [newDeviceType, setNewDeviceType] = useState<DeviceItem["type"]>("إعارة مجانية");
  const [newFeeText, setNewFeeText] = useState(market.mock ? "مجاناً للطلاب" : "");
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
    if (!newDeviceName.trim()) return;
    if (!market.mock) {
      void market.perform(async () => {
        const rental = newDeviceType === "استئجار رمزي";
        const exchange = newDeviceType === "تبادل بأداة أخرى";
        const terms = newFeeText.trim();
        const rentalTerms = rental ? /^(\d+(?:\.\d{1,2})?)\s*\/\s*(\d+)$/.exec(terms) : null;
        if (rental && (!rentalTerms || Number(rentalTerms[2]) < 1 || Number(rentalTerms[2]) > 3650)) {
          throw new Error("أدخل السعر بالشيكل ثم شرطة مائلة ثم المدة بالأيام، مثل 15 / 7.");
        }
        if (exchange && !terms) throw new Error("حدّد الأداة المطلوبة بالمقابل.");
        const offer = await marketplaceService.publish({
          item_type: "DEVICE",
          title: newDeviceName.trim(),
          description: newDeviceName.trim(),
          item_condition: "GOOD",
          offer_type: rental ? "RENTAL" : exchange ? "TEMPORARY_EXCHANGE" : "LOAN",
          price: rentalTerms ? Number(rentalTerms[1]) : undefined,
          duration_days: rentalTerms ? Number(rentalTerms[2]) : undefined,
          currency: rental ? "ILS" : undefined,
          item_details: { category: newDeviceCategory, exchange_target: exchange ? terms : undefined },
        });
        market.setOffers((rows) => [offer, ...rows.filter((row) => row.id !== offer.id)]);
        setIsAddModalOpen(false);
        setNewDeviceName("");
        setNewFeeText("");
        notify({ type: "rent", title: "تم نشر الجهاز", message: offer.title });
      });
      return;
    }
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

    setDevices((items) => [newDevice, ...items]);

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
    mock: market.mock,
    busy: market.busy,
    requestDevice: (device: DeviceItem) => market.mock ? setRequestingDevice(device) : market.request(device.id, user?.id),
  };
}

