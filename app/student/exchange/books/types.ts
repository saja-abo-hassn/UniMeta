export type BookListingType = "بيع" | "استئجار" | "تبادل";

export interface ExchangeBook {
  id: string;
  title: string;
  courseCode: string;
  courseName: string;
  author: string;
  owner: string;
  ownerMajor: string;
  condition: "ممتازة" | "جيدة جداً" | "جيدة";
  type: BookListingType;
  price?: number;
  rentalPeriod?: string;
  exchangeTarget?: string;
  status: "متاح فوراً" | "قيد الاستعارة" | "محجوز";
  notes: string;
}

