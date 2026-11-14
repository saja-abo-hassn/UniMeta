"use client";
import { apiClient } from "@/src/services/api-client";
import { LiveMarketplace } from "@/components/integration/live-marketplace";

import dynamic from "next/dynamic";
import { useExchangeBooks } from "./hooks/use-exchange-books";
import { BooksHeader } from "./components/books-header";
import { BooksKPIs } from "./components/books-kpis";
import { BooksFilterBar } from "./components/books-filter-bar";
import { BooksGrid } from "./components/books-grid";

export type { BookListingType, ExchangeBook } from "./types";

const DynamicTwoStepExchangeModal = dynamic(
  () =>
    import("@/components/student/exchange/two-step-exchange-modal").then(
      (mod) => mod.TwoStepExchangeModal
    ),
  { ssr: false }
);

import { AddBookModal } from "./components/add-book-modal";

export default function BookExchangePage() { return apiClient.isUsingMock() ? <MockBookExchangePage/> : <LiveMarketplace kind="BOOK"/>; }
function MockBookExchangePage() {
  const {
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
  } = useExchangeBooks();

  return (
    <div className="space-y-6 animate-fade-in" dir="rtl">
      <BooksHeader onOpenAddModal={() => setIsAddBookModalOpen(true)} />

      <BooksKPIs books={books} />

      <BooksFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        conditionFilter={conditionFilter}
        onConditionFilterChange={setConditionFilter}
      />

      <BooksGrid
        books={filteredBooks}
        onRequestBook={(bk) => setRequestingBook(bk)}
      />

      {requestingBook && (
        <DynamicTwoStepExchangeModal
          isOpen={!!requestingBook}
          onClose={() => setRequestingBook(null)}
          item={{
            id: requestingBook.id,
            title: requestingBook.title,
            category: "كتب ومراجع",
            ownerName: requestingBook.owner,
            ownerMajor: requestingBook.ownerMajor,
            depositAmount: requestingBook.price
              ? Math.max(10, Math.round(requestingBook.price * 0.8))
              : 10,
            dailyRate:
              requestingBook.type === "استئجار"
                ? requestingBook.price
                  ? Math.max(1, Math.round(requestingBook.price / 30))
                  : 1
                : 0,
            durationDays: requestingBook.rentalPeriod === "شهر" ? 30 : 90,
            durationText: requestingBook.rentalPeriod || "فصل دراسي",
          }}
          currentStudent={{
            name: currentStudentName,
            studentId: currentStudentName.includes("ريم") ? "20221084" : undefined,
            major: currentStudentMajor,
          }}
        />
      )}

      {isAddBookModalOpen && (
        <AddBookModal
          isOpen={isAddBookModalOpen}
          onClose={() => setIsAddBookModalOpen(false)}
          onSubmit={handleAddBookSubmit}
        />
      )}
    </div>
  );
}
