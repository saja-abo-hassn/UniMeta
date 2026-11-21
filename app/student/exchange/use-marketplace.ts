"use client";

import { useEffect, useRef, useState } from "react";
import { useNotifications } from "@/src/contexts/notifications-context";
import { apiClient } from "@/src/services/api-client";
import { reportApiError } from "@/src/services/api-result";
import { marketplaceService, type MarketplaceKind, type MarketplaceOffer } from "@/src/services/marketplace-service";

export function useMarketplace(kind: MarketplaceKind) {
  const mock = apiClient.isUsingMock();
  const { notify } = useNotifications();
  const [offers, setOffers] = useState<MarketplaceOffer[]>([]);
  const pending = useRef(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (mock) return;
    let active = true;
    void marketplaceService.offers(kind).then((rows) => {
      if (active) setOffers((current) => [...current, ...rows.filter((row) => !current.some((offer) => offer.id === row.id))]);
    }).catch((error: unknown) => {
      if (active) reportApiError(error);
    });
    return () => { active = false; };
  }, [kind, mock]);

  async function perform(action: () => Promise<void>) {
    if (pending.current) return;
    pending.current = true;
    setBusy(true);
    try {
      await action();
    } catch (error) {
      reportApiError(error);
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }

  function request(id: string, currentUserId: string | undefined) {
    if (!currentUserId || pending.current) return;
    const offer = offers.find((row) => String(row.id) === id);
    if (!offer || String(offer.owner.id) === currentUserId) return;
    const message = window.prompt("رسالة اختيارية لصاحب العرض. اضغط موافق لإرسال الطلب.");
    if (message === null) return;
    void perform(async () => {
      await marketplaceService.request(id, message.trim());
      notify({ type: "exchange", title: "تم إرسال طلبك", message: "أُرسل الطلب لصاحب العرض للمراجعة." });
    });
  }

  return { mock, offers, setOffers, perform, request, busy };
}
