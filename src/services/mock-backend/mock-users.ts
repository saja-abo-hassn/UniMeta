import { API_CONFIG } from "../api-client";

export interface MockUser {
  id: string;
  name: string;
  email: string;
  studentId?: string;
  faculty?: string;
  password?: string;
  role: "student" | "admin";
  createdAt: string;
  emailVerified: boolean;
}

const SEED_USERS: MockUser[] = [
  {
    id: "usr-1",
    name: "ريم حاتم النجار",
    email: "reem@student.alazhar.edu.ps",
    studentId: "20221102",
    faculty: "كلية الهندسة وتكنولوجيا المعلومات",
    password: "password123",
    role: "student",
    createdAt: "2026-01-15",
    emailVerified: true,
  },
  {
    id: "usr-2",
    name: "أحمد حسني البطش",
    email: "ahmed@student.alazhar.edu.ps",
    studentId: "20211102",
    faculty: "كلية الهندسة وتكنولوجيا المعلومات",
    password: "password123",
    role: "student",
    createdAt: "2026-01-20",
    emailVerified: true,
  },
  {
    id: "usr-admin",
    name: "م. أحمد عابد",
    email: "admin@unimeta.edu.ps",
    password: "password123",
    role: "admin",
    createdAt: "2026-01-01",
    emailVerified: true,
  },
];

export function getStoredUsers(): MockUser[] {
  if (typeof window === "undefined") return SEED_USERS;
  try {
    const raw = localStorage.getItem(API_CONFIG.storageKeys.registeredUsers);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Merge seed users with newly registered users
        const seedEmails = new Set(SEED_USERS.map((u) => u.email.toLowerCase()));
        const customUsers = parsed.filter((u) => !seedEmails.has(u.email.toLowerCase()));
        return [...SEED_USERS, ...customUsers];
      }
    }
  } catch {
    // ignore
  }
  return SEED_USERS;
}

export function saveNewUser(newUser: MockUser): void {
  if (typeof window === "undefined") return;
  try {
    const currentUsers = getStoredUsers();
    const updated = [newUser, ...currentUsers.filter((u) => u.email.toLowerCase() !== newUser.email.toLowerCase())];
    localStorage.setItem(API_CONFIG.storageKeys.registeredUsers, JSON.stringify(updated));
  } catch {
    // ignore
  }
}

export function markUserEmailVerified(email: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const cleanEmail = email.toLowerCase().trim();
    const currentUsers = getStoredUsers();
    let found = false;
    const updated = currentUsers.map((u) => {
      if (u.email.toLowerCase() === cleanEmail) {
        found = true;
        return { ...u, emailVerified: true };
      }
      return u;
    });

    if (found) {
      localStorage.setItem(API_CONFIG.storageKeys.registeredUsers, JSON.stringify(updated));
      return true;
    }
  } catch {
    // ignore
  }
  return false;
}

export function findUserByEmailOrId(identifier: string): MockUser | null {
  const clean = identifier.toLowerCase().trim();
  const users = getStoredUsers();
  return (
    users.find(
      (u) =>
        u.email.toLowerCase() === clean ||
        (u.studentId && u.studentId.trim().toLowerCase() === clean)
    ) || null
  );
}
