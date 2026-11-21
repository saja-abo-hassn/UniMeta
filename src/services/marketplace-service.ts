import { apiClient } from "./api-client";
import { requireData } from "./api-result";

export type MarketplaceKind = "BOOK" | "DEVICE";
export type OfferType = "LOAN" | "SALE" | "RENTAL" | "TEMPORARY_EXCHANGE" | "PERMANENT_EXCHANGE";
export type OfferCondition = "NEW" | "LIKE_NEW" | "GOOD" | "FAIR";
export type OfferCurrency = "ILS" | "JOD" | "USD";
type ItemDetails = Partial<Record<"author" | "course_code" | "course_name" | "model" | "category" | "exchange_target", string>>;
interface OfferFields {
  title: string;
  description: string;
  item_type: MarketplaceKind;
  offer_type: OfferType;
  item_condition: OfferCondition;
  item_details: ItemDetails;
  price?: number;
  currency?: OfferCurrency;
  duration_days?: number;
}
export interface MarketplaceOffer extends Omit<OfferFields, "price" | "item_details"> {
  id: number;
  owner: { id: number; full_name: string };
  availability_status: "ACTIVE" | "PAUSED" | "RESERVED" | "CLOSED";
  price?: string | number;
  deposit?: string | number;
  item_details?: ItemDetails;
}
interface MarketplaceRequest {
  id: number;
  offer_id: number;
  offer?: { title: string };
  requester?: { full_name: string };
  message: string | null;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "WITHDRAWN" | "CANCELLED";
  created_at: string;
}

export const offerConditions = {
  "ممتازة": "LIKE_NEW",
  "جيدة جداً": "GOOD",
  "جيدة": "FAIR",
} satisfies Record<string, OfferCondition>;

export const conditionLabels = {
  NEW: "ممتازة",
  LIKE_NEW: "ممتازة",
  GOOD: "جيدة جداً",
  FAIR: "جيدة",
} as const;

export const marketplaceService = {
  async offers(kind: MarketplaceKind) {
    return requireData(await apiClient.all<MarketplaceOffer>("/marketplace/offers?item_type=" + kind));
  },
  async publish(fields: OfferFields) {
    return requireData(await apiClient.post<MarketplaceOffer>("/marketplace/offers", fields));
  },
  async request(id: string, message: string) {
    return requireData(await apiClient.post("/marketplace/offers/" + encodeURIComponent(id) + "/requests", { message: message || null }));
  },
  async outgoing() {
    return requireData(await apiClient.all<MarketplaceRequest>("/students/me/marketplace-requests"));
  },
  async incoming() {
    const offers = requireData(await apiClient.all<MarketplaceOffer>("/students/me/marketplace-offers"));
    const lists = await Promise.all(offers.filter((offer) => offer.availability_status === "ACTIVE").map(async (offer) => ({
      offer,
      requests: requireData(await apiClient.all<MarketplaceRequest>("/marketplace/offers/" + offer.id + "/requests")),
    })));
    return lists.flatMap(({ offer, requests }) => requests.filter((request) => request.status === "PENDING").map((request) => ({ offer, request })));
  },
  async respond(id: string, action: "accept" | "reject" | "withdraw", fields?: { return_due_date?: string; exchange_item?: string }) {
    return requireData(await apiClient.post("/marketplace-requests/" + encodeURIComponent(id) + "/" + action, fields));
  },
};
