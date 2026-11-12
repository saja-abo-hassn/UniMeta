export interface DeviceItem {
  id: string;
  name: string;
  category: "متحكمات ومستشعرات" | "حواسيب وشاشات" | "أدوات قياس ومعدات" | "أجهزة شبكات";
  model: string;
  owner: string;
  ownerMajor: string;
  condition: "ممتازة" | "جيدة جداً" | "جيدة";
  type: "استئجار رمزي" | "إعارة مجانية" | "تبادل بأداة أخرى";
  feeText: string;
  deposit: string;
  status: "متاح فوراً" | "قيد الاستعارة" | "محجوز";
  description: string;
}

