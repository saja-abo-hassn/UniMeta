"use client";

import { useState } from "react";
import { useNotifications } from "@/src/contexts/notifications-context";
import { useStudentUser } from "@/src/hooks/use-student-user";
import { useStudyPlan } from "@/src/contexts/study-plan-context";
import { BookListingType, ExchangeBook } from "../types";
import { initialBooks } from "../data/initial-books";

export function useExchangeBooks() {
  const { notify } = useNotifications();
  const { fullName } = useStudentUser();
  const { selectedPlan, hasPlanSelected } = useStudyPlan();

  const currentStudentName = fullName || "طالب UniMeta";
  const currentStudentMajor = hasPlanSelected ? selectedPlan.major : "تكنولوجيا المعلومات";

  const [books, setBooks] = useState<ExchangeBook[]>(initialBooks);
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

  const handleAddBookSubmit = (e: React.FormEvent, payload?: any) => {
    e.preventDefault();
    const titleVal = payload?.title || newTitle;
    if (!titleVal.trim()) return;

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

    setBooks([newBook, ...books]);
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
  };
}

