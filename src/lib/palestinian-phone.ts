export function isPalestinianMobile(value: string): boolean {
  return /^(059|056)\d{7}$/.test(value);
}
