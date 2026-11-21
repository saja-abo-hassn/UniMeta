import type { OfferCurrency } from "@/src/services/marketplace-service";

export type BookListingType = "بيع" | "استئجار" | "تبادل" | "إعارة";

export interface ExchangeBook {
  id: string;
  title: string;
  courseCode: string;
  courseName: string;
  author: string;
  owner: string;
  ownerMajor: string;
  contactPhone?: string;
  condition: "ممتازة" | "جيدة جداً" | "جيدة";
  type: BookListingType;
  price?: number;
  currency?: OfferCurrency;
  ownOffer?: boolean;
  rentalPeriod?: string;
  exchangeTarget?: string;
  status: "متاح فوراً" | "قيد الاستعارة" | "محجوز";
  notes: string;
}

