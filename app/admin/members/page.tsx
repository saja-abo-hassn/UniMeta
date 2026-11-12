"use client";

import React from "react";
import dynamic from "next/dynamic";
import { PermissionGuard } from "@/components/admin/permission-guard";
import { useAdminMembers } from "./hooks/use-admin-members";
import { MembersHeader } from "./components/members-header";
import { MembersKPIs } from "./components/members-kpis";
import { MembersFilterBar } from "./components/members-filter-bar";
import { MembersTable } from "./components/members-table";

export type { MemberStatus, StatusFilter } from "./types";

const DynamicMemberDetailsModal = dynamic(
  () => import("./components/member-modals").then((mod) => mod.MemberDetailsModal),
  { ssr: false }
);

const DynamicMemberStatusModal = dynamic(
  () => import("./components/member-modals").then((mod) => mod.MemberStatusModal),
  { ssr: false }
);

export default function AdminMembersPage() {
  const {
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
  } = useAdminMembers();

  return (
    <PermissionGuard permission="manage_members">
      <div className="space-y-6 animate-fade-in" dir="rtl">
        <MembersHeader />

        <MembersKPIs counts={counts} />

        <MembersFilterBar
          counts={counts}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          collegeFilter={collegeFilter}
          setCollegeFilter={setCollegeFilter}
          collegesList={collegesList}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <MembersTable
          filteredMembers={filteredMembers}
          onSelectMember={setSelectedMember}
          onOpenStatusChange={openStatusChange}
        />

        {selectedMember && (
          <DynamicMemberDetailsModal
            member={selectedMember}
            onClose={() => setSelectedMember(null)}
          />
        )}

        {statusChangeMember && (
          <DynamicMemberStatusModal
            member={statusChangeMember}
            newStatus={newStatus}
            setNewStatus={setNewStatus}
            onClose={() => setStatusChangeMember(null)}
            onSubmit={handleStatusSubmit}
          />
        )}
      </div>
    </PermissionGuard>
  );
}
