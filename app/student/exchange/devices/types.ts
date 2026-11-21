export interface DeviceItem {
  id: string;
  name: string;
  category: string;
  model: string;
  owner: string;
  ownerMajor: string;
  contactPhone?: string;
  ownOffer?: boolean;
  condition: "ممتازة" | "جيدة جداً" | "جيدة";
  type: "استئجار رمزي" | "إعارة مجانية" | "تبادل بأداة أخرى" | "بيع";
  feeText: string;
  deposit: string;
  status: "متاح فوراً" | "قيد الاستعارة" | "محجوز";
  description: string;
}

