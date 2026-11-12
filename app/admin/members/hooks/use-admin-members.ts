"use client";

import { useState, useMemo } from "react";
import { useAdmin, AdminMemberItem } from "@/src/contexts/admin-context";
import { MemberStatus, StatusFilter } from "../types";

export function useAdminMembers() {
  const { members, updateMemberStatus } = useAdmin();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [collegeFilter, setCollegeFilter] = useState<string>("all");

  const [selectedMember, setSelectedMember] = useState<AdminMemberItem | null>(null);
  const [statusChangeMember, setStatusChangeMember] = useState<AdminMemberItem | null>(null);
  const [newStatus, setNewStatus] = useState<MemberStatus>("نشط");

  const collegesList = useMemo(() => {
    const set = new Set(members.map((m) => m.college));
    return Array.from(set);
  }, [members]);

  const counts = useMemo(() => {
    return {
      total: members.length,
      active: members.filter((m) => m.status === "نشط").length,
      suspended: members.filter((m) => m.status === "معلق").length,
      banned: members.filter((m) => m.status === "محظور").length,
    };
  }, [members]);

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      if (statusFilter !== "all" && m.status !== statusFilter) return false;
      if (collegeFilter !== "all" && m.college !== collegeFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchesId = m.studentId.toLowerCase().includes(q);
        const matchesName = m.name.toLowerCase().includes(q);
        const matchesEmail = m.email.toLowerCase().includes(q);
        const matchesMajor = m.major.toLowerCase().includes(q);
        return matchesId || matchesName || matchesEmail || matchesMajor;
      }
      return true;
    });
  }, [members, statusFilter, collegeFilter, searchQuery]);

  const handleStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusChangeMember) return;
    updateMemberStatus(statusChangeMember.id, newStatus);
    setStatusChangeMember(null);
  };

  const openStatusChange = (member: AdminMemberItem) => {
    setStatusChangeMember(member);
    setNewStatus(member.status);
  };

  return {
    members,
    filteredMembers,
    collegesList,
    counts,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    collegeFilter,
    setCollegeFilter,
    selectedMember,
    setSelectedMember,
    statusChangeMember,
    setStatusChangeMember,
    newStatus,
    setNewStatus,
    handleStatusSubmit,
    openStatusChange,
  };
}

