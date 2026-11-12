export interface TwoStepExchangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingAgreementId?: string;
  item: {
    id: string;
    title: string;
    category: "أجهزة" | "كتب ومراجع";
    ownerName: string;
    ownerMajor: string;
    depositAmount: number;
    dailyRate?: number;
    durationDays?: number;
    durationText?: string;
  };
  currentStudent: {
    name: string;
    studentId?: string;
    major?: string;
    faculty?: string;
  };
  onSuccess?: (agreementId: string) => void;
}

