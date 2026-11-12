export interface StudentKycData {
  nationalId: string;
  maskedNationalId: string;
  phone: string;
  maskedPhone: string;
  studentId: string;
  fullName: string;
  college?: string;
  major?: string;
  isPhoneVerified: boolean;
}

export interface AgreementSignature {
  type: "canvas" | "upload";
  dataUrl: string;
  mimeType: string;
  sizeBytes: number;
  uploadedAt: string;
}

export interface AgreementPledge {
  pledgeText: string;
  pledgeVersion: string;
  agreed: boolean;
  agreedAt: string;
}

export interface ExchangeRequestPayload {
  existingAgreementId?: string;
  itemType: "أجهزة" | "كتب ومراجع";
  itemId: string;
  itemName: string;
  itemCategory: string;
  ownerName: string;
  ownerMajor: string;
  depositAmount: number;
  dailyRate?: number;
  durationDays?: number;
  durationText?: string;
  proposedStartDate: string;
  notes?: string;
  studentKyc: StudentKycData;
  pledge: AgreementPledge;
  signature: AgreementSignature;
}

export interface OutgoingAgreementRequest {
  id: string;
  itemName: string;
  category: "أجهزة" | "كتب ومراجع";
  ownerName: string;
  ownerMajor: string;
  requestedDuration: string;
  proposedStartDate: string;
  deposit: number;
  status: "قيد المراجعة" | "تمت الموافقة" | "مرفوض";
  requestDate: string;
  signatureUrl: string;
  pledgeVersion: string;
  rejectionReason?: string;
  studentKyc: StudentKycData;
}

