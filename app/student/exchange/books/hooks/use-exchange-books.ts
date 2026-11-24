"use client";

import { useState } from "react";
import { useNotifications } from "@/src/contexts/notifications-context";
import { useStudentUser } from "@/src/hooks/use-student-user";
import { useStudyPlan } from "@/src/contexts/study-plan-context";
import { BookListingType, ExchangeBook } from "../types";
import { initialBooks } from "../data/initial-books";
import { conditionLabels, marketplaceService, offerConditions, type OfferType } from "@/src/services/marketplace-service";
import { useMarketplace } from "../../use-marketplace";
import { isPalestinianMobile } from "@/src/lib/palestinian-phone";
import type { NewBookPayload } from "../components/add-book-modal";

export function useExchangeBooks() {
  const { notify } = useNotifications();
  const { fullName, user } = useStudentUser();
  const market = useMarketplace("BOOK");
  const { selectedPlan, hasPlanSelected } = useStudyPlan();

  const currentStudentName = fullName || "طالب UniMeta";
  const currentStudentMajor = hasPlanSelected ? selectedPlan.major : "تكنولوجيا المعلومات";

  const [mockBooks, setBooks] = useState<ExchangeBook[]>(initialBooks);
  const bookTypes: Record<OfferType, BookListingType> = {
    LOAN: "إعارة", SALE: "بيع", RENTAL: "استئجار",
    TEMPORARY_EXCHANGE: "تبادل", PERMANENT_EXCHANGE: "تبادل",
  };
  const books: ExchangeBook[] = market.mock ? mockBooks : market.offers.map((offer) => ({
    id: String(offer.id),
    title: offer.title,
    courseCode: offer.item_details?.course_code || "—",
    courseName: offer.item_details?.course_name || "—",
    author: offer.item_details?.author || "—",
    owner: offer.owner.full_name,
    ownerMajor: "",
    ownOffer: String(offer.owner.id) === user?.id,
    condition: conditionLabels[offer.item_condition],
    type: bookTypes[offer.offer_type],
    price: offer.price == null ? undefined : Number(offer.price),
    currency: offer.currency,
    rentalPeriod: offer.duration_days ? offer.duration_days + " يوم" : undefined,
    exchangeTarget: offer.item_details?.exchange_target,
    contactPhone: offer.contact_phone ?? undefined,
    status: "متاح فوراً",
    notes: offer.description,
  }));
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | BookListingType>("all");
  const [conditionFilter, setConditionFilter] = useState("all");

  const [requestingBook, setRequestingBook] = useState<ExchangeBook | null>(null);

  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCourseCode, setNewCourseCode] = useState("ENCS3310");
  const [newCourseName, setNewCourseName] = useState("هندسة البرمجيات");
  const [newAuthor, setNewAuthor] = useState("");
  const [newType, setNewType] = useState<BookListingType>("بيع");
  const [newPrice, setNewPrice] = useState<number>(25);
  const [newRentalPeriod, setNewRentalPeriod] = useState("فصل دراسي");
  const [newExchangeTarget, setNewExchangeTarget] = useState("");
  const [newCondition, setNewCondition] = useState<ExchangeBook["condition"]>("ممتازة");
  const [newNotes, setNewNotes] = useState("");

  const filteredBooks = books.filter((b) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      b.title.toLowerCase().includes(q) ||
      b.courseCode.toLowerCase().includes(q) ||
      b.courseName.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.owner.toLowerCase().includes(q);

    const matchesType = typeFilter === "all" || b.type === typeFilter;
    const matchesCondition = conditionFilter === "all" || b.condition === conditionFilter;

    return matchesSearch && matchesType && matchesCondition;
  });

  const handleAddBookSubmit = (e: React.FormEvent, payload?: NewBookPayload) => {
    e.preventDefault();
    if (!market.mock) {
      if (!payload?.title.trim()) return;
      void market.perform(async () => {
        const isRental = payload.type === "استئجار";
        const isExchange = payload.type === "تبادل";
        const price = isRental || payload.type === "بيع" ? payload.price : undefined;
        const duration = isRental ? Number(payload.rentalPeriod) : undefined;
        const target = payload.exchangeTarget?.trim();
        if (isRental && (!duration || !Number.isInteger(duration) || duration > 3650 || duration < 1)) {
          throw new Error("أدخل مدة الاستئجار بالأيام، من 1 إلى 3650.");
        }
        if (isExchange && !target) throw new Error("حدّد الكتاب المطلوب بالمقابل.");
        const phone = payload.contactPhone?.trim() || null;
        if (phone && !isPalestinianMobile(phone)) throw new Error("أدخل رقم جوال فلسطيني من 10 أرقام يبدأ بـ 059 أو 056.");
        const offer = await marketplaceService.publish({
          item_type: "BOOK",
          contact_phone: phone,
          title: payload.title.trim(),
          description: payload.notes?.trim() || payload.title.trim(),
          offer_type: isRental ? "RENTAL" : isExchange ? "PERMANENT_EXCHANGE" : payload.type === "إعارة" ? "LOAN" : "SALE",
          item_condition: offerConditions[payload.condition],
          price,
          currency: price == null ? undefined : "ILS",
          duration_days: duration,
          item_details: {
            course_code: payload.courseCode.trim() || undefined,
            author: payload.author.trim() || undefined,
            exchange_target: isExchange ? target : undefined,
          },
        });
        market.setOffers((rows) => [offer, ...rows.filter((row) => row.id !== offer.id)]);
        setIsAddBookModalOpen(false);
        notify({ type: "exchange", title: "تم نشر الكتاب", message: offer.title });
      });
      return;
    }
    const titleVal = payload?.title || newTitle;
    if (!titleVal.trim()) return;
    if (!isPalestinianMobile(payload?.contactPhone || "")) return;

    const courseCodeVal = payload?.courseCode || newCourseCode;
    const authorVal = payload?.author || newAuthor;
    const typeVal = payload?.type || newType;
    const priceVal = payload?.price !== undefined ? payload.price : newPrice;
    const rentalPeriodVal = payload?.rentalPeriod || newRentalPeriod;
    const exchangeTargetVal = payload?.exchangeTarget || newExchangeTarget;
    const conditionVal = payload?.condition || newCondition;
    const notesVal = payload?.notes !== undefined ? payload.notes : newNotes;

    const newBook: ExchangeBook = {
      id: `bk-${Date.now()}`,
      title: titleVal.trim(),
      courseCode: courseCodeVal.trim() || "GENERAL",
      courseName: newCourseName.trim() || "متطلب جامعي",
      author: authorVal.trim() || "غير محدد",
      owner: currentStudentName,
      ownerMajor: currentStudentMajor,
      contactPhone: payload?.contactPhone,
      condition: conditionVal,
      type: typeVal,
      price: typeVal === "تبادل" ? undefined : priceVal,
      rentalPeriod: typeVal === "استئجار" ? rentalPeriodVal : undefined,
      exchangeTarget: typeVal === "تبادل" ? exchangeTargetVal.trim() : undefined,
      status: "متاح فوراً",
      notes:
        notesVal.trim() ||
        (typeVal === "بيع" ? "بيع نهائي للكتاب." : "متاح للمعاينة والتسليم داخل الجامعة."),
    };

    setBooks((items) => [newBook, ...items]);
    setIsAddBookModalOpen(false);

    notify({
      type: "exchange",
      title: "تم نشر الكتاب بنجاح! 📚",
      message: `تمت إضافة كتاب "${titleVal}" إلى قسم الكتب (${typeVal}) بالشيكل ₪.`,
      playSound: true,
      browserNotify: true,
    });

    setNewTitle("");
    setNewAuthor("");
    setNewPrice(25);
    setNewRentalPeriod("فصل دراسي");
    setNewExchangeTarget("");
    setNewNotes("");
  };

  return {
    books,
    filteredBooks,
    currentStudentName,
    currentStudentMajor,
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    conditionFilter,
    setConditionFilter,
    requestingBook,
    setRequestingBook,
    isAddBookModalOpen,
    setIsAddBookModalOpen,
    newTitle,
    setNewTitle,
    newCourseCode,
    setNewCourseCode,
    newCourseName,
    setNewCourseName,
    newAuthor,
    setNewAuthor,
    newType,
    setNewType,
    newPrice,
    setNewPrice,
    newRentalPeriod,
    setNewRentalPeriod,
    newExchangeTarget,
    setNewExchangeTarget,
    newCondition,
    setNewCondition,
    newNotes,
    setNewNotes,
    handleAddBookSubmit,
    mock: market.mock,
    busy: market.busy,
    requestBook: (book: ExchangeBook) => market.mock ? setRequestingBook(book) : market.request(book.id, user?.id),
  };
}

