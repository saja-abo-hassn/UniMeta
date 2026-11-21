export interface AgreementItem {
  id: string;
  itemName: string;
  category: "أجهزة" | "كتب ومراجع" | "—";
  itemImage?: string;
  otherParty: {
    name: string;
    major: string;
    role: "المالك" | "المستعير";
    phone?: string;
  };
  startDate: string;
  returnDeadline: string;
  daysRemaining: number;
  depositAmount: number;
  dailyRate?: number;
  status: "نشطة" | "بانتظار الإرجاع" | "مكتملة";
  notes?: string;
  live?: { statusLabel: string; depositLabel: string };
}

export interface OutgoingRequestItem {
  id: string;
  itemName: string;
  category: "أجهزة" | "كتب ومراجع" | "—";
  ownerName: string;
  ownerMajor: string;
  requestedDuration: string;
  proposedStartDate: string;
  deposit: number | null;
  status: "قيد المراجعة" | "تمت الموافقة" | "مرفوض" | "طلب تعديل" | "مسحوب" | "ملغى";
  requestDate: string;
  rejectionReason?: string;
  modificationNote?: string;
  signatureUrl?: string;
  pledgeVersion?: string;
}

export interface IncomingRequestItem {
  id: string;
  itemName: string;
  category: "أجهزة" | "كتب ومراجع";
  requesterName: string;
  requesterMajor: string;
  requesterGpaRange?: string;
  requestedDuration: string;
  proposedStartDate: string;
  requestDate: string;
  message?: string;
  offerId?: number;
  offerType?: import("@/src/services/marketplace-service").OfferType;
}

