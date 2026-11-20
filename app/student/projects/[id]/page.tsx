import React from "react";
import { initialGraduationProjects } from "@/src/data/graduation-projects-data";
import { ProjectDetailsView } from "@/components/student/project-details-view";

export function generateStaticParams() {
  return initialGraduationProjects.map((p) => ({ id: p.id }));
}

export default async function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProjectDetailsView id={id} />;
}
