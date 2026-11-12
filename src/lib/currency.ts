/**
 * Unified Currency Formatter Helper
 * Ensures strict currency isolation across UniMeta:
 * - Books, Devices, Exchange, Rental, and Agreements: ILS (₪)
 * - University Tuition & Credit Fees: JOD (د.أ)
 */

export type CurrencyCode = "ILS" | "JOD";

export function formatCurrency(
  amount: number | string,
  currency: CurrencyCode = "ILS"
): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) {
    return `${amount} ${currency === "ILS" ? "₪" : "د.أ"}`;
  }

  // Display cleanly: integer without decimals, or 1-2 decimals if fractional
  const displayNum = Number.isInteger(num) ? num.toString() : (Math.round(num * 10) / 10).toString();

  if (currency === "ILS") {
    return `${displayNum} ₪`;
  }

  return `${displayNum} د.أ`;
}

export function getCurrencySymbol(currency: CurrencyCode = "ILS"): string {
  return currency === "ILS" ? "₪" : "د.أ";
}

export function getCurrencyName(currency: CurrencyCode = "ILS"): string {
  return currency === "ILS" ? "شيكل إسرائيلي (₪)" : "دينار أردني (د.أ)";
}

