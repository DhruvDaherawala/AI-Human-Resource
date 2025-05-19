import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Jobs - AI HR System",
  description: "Manage your job listings and requirements",
}

export default function JobsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 