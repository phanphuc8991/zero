"use client";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

import DataTable from "@/components/data-table/data-table";
import { Course, courseColumns } from "@/components/data-table/course-columns";
import { useRouter } from "next/navigation";
const myCoursesData: Course[] = [
  {
    id: 1,
    title: "Ultimate Content Creation Mastery",
    slug: "ultimate-content-creation-mastery",
    durationHours: 12,
    level: "all",
    isPublished: true,
    instructorName: "Ethan Walker",
  },
  {
    id: 2,
    title: "Automate Job Flow With AI",
    slug: "automate-job-flow-with-ai",
    durationHours: 10,
    level: "intermediate",
    isPublished: true,
    instructorName: "Olivia Hayes",
  },
  {
    id: 3,
    title: "Framer Website Design Mastery",
    slug: "framer-website-design-mastery",
    durationHours: 15,
    level: "advanced",
    isPublished: false,
    instructorName: "Lucas Bennett",
  },
  {
    id: 4,
    title: "No-Code SaaS Development with Bubble",
    slug: "no-code-saas-development-bubble",
    durationHours: 18,
    level: "advanced",
    isPublished: true,
    instructorName: "Olivia Hayes",
  },
  {
    id: 5,
    title: "Prompt Engineering for Digital Marketers",
    slug: "prompt-engineering-digital-marketers",
    durationHours: 4,
    level: "beginner",
    isPublished: true,
    instructorName: "Ethan Walker",
  },
  {
    id: 6,
    title: "UI/UX Design Strategy & Component Systems",
    slug: "ui-ux-design-strategy-component-systems",
    durationHours: 14,
    level: "intermediate",
    isPublished: false,
    instructorName: "Sophia Reynolds",
  },
  {
    id: 7,
    title: "Data Analytics & SQL Dashboard Bootcamp",
    slug: "data-analytics-sql-dashboard-bootcamp",
    durationHours: 22,
    level: "beginner",
    isPublished: true,
    instructorName: "Dr. Amelia Scott",
  },
  {
    id: 8,
    title: "Growth Hacking: advanced Lead Generation",
    slug: "growth-hacking-advanced-lead-generation",
    durationHours: 8,
    level: "intermediate",
    isPublished: true,
    instructorName: "Ethan Walker",
  },
  {
    id: 9,
    title: "Make Automation Work for Agencies",
    slug: "make-automation-work-for-agencies",
    durationHours: 11,
    level: "advanced",
    isPublished: true,
    instructorName: "Olivia Hayes",
  },
  {
    id: 10,
    title: "Figma advanced Prototyping Workshop",
    slug: "figma-advanced-prototyping-workshop",
    durationHours: 6,
    level: "advanced",
    isPublished: true,
    instructorName: "Sophia Reynolds",
  },
  {
    id: 11,
    title: "Python Foundations for Non-Programmers",
    slug: "python-foundations-for-non-programmers",
    durationHours: 16,
    level: "beginner",
    isPublished: false,
    instructorName: "Dr. Amelia Scott",
  },
  {
    id: 12,
    title: "Webflow Blueprint: Code-Free Production",
    slug: "webflow-blueprint-code-free-production",
    durationHours: 13,
    level: "intermediate",
    isPublished: true,
    instructorName: "Lucas Bennett",
  },
  {
    id: 13,
    title: "AI Video Production & Scriptwriting",
    slug: "ai-video-production-scriptwriting",
    durationHours: 7,
    level: "all",
    isPublished: true,
    instructorName: "Ethan Walker",
  },
  {
    id: 14,
    title: "Zapier & Make: Enterprise Automations",
    slug: "zapier-make-enterprise-automations",
    durationHours: 20,
    level: "advanced",
    isPublished: false,
    instructorName: "Olivia Hayes",
  },
  {
    id: 15,
    title: "Design Systems for Scalable Products",
    slug: "design-systems-for-scalable-products",
    durationHours: 19,
    level: "advanced",
    isPublished: true,
    instructorName: "Sophia Reynolds",
  },
  {
    id: 16,
    title: "Google Looker Studio Masterclass",
    slug: "google-looker-studio-masterclass",
    durationHours: 5,
    level: "intermediate",
    isPublished: true,
    instructorName: "Dr. Amelia Scott",
  },
  {
    id: 17,
    title: "SEO Copywriting in the Age of AI",
    slug: "seo-copywriting-in-the-age-of-ai",
    durationHours: 9,
    level: "beginner",
    isPublished: true,
    instructorName: "Ethan Walker",
  },
  {
    id: 18,
    title: "Landing Page Conversion Optimization",
    slug: "landing-page-conversion-optimization",
    durationHours: 12,
    level: "intermediate",
    isPublished: false,
    instructorName: "Lucas Bennett",
  },
  {
    id: 19,
    title: "UX Research Methods & Usability Testing",
    slug: "ux-research-methods-usability-testing",
    durationHours: 10,
    level: "all",
    isPublished: true,
    instructorName: "Sophia Reynolds",
  },
  {
    id: 20,
    title: "Data Storytelling with Tableau",
    slug: "data-storytelling-with-tableau",
    durationHours: 14,
    level: "intermediate",
    isPublished: true,
    instructorName: "Dr. Amelia Scott",
  },
  {
    id: 21,
    title: "3D Web Design with Spline & Framer",
    slug: "3d-web-design-with-spline-framer",
    durationHours: 16,
    level: "advanced",
    isPublished: true,
    instructorName: "Lucas Bennett",
  },
  {
    id: 22,
    title: "Midjourney Mastery for Digital Artists",
    slug: "midjourney-mastery-for-digital-artists",
    durationHours: 3,
    level: "beginner",
    isPublished: true,
    instructorName: "Ethan Walker",
  },
  {
    id: 23,
    title: "No-Code CRM Architecture with Airtable",
    slug: "no-code-crm-architecture-with-airtable",
    durationHours: 11,
    level: "intermediate",
    isPublished: false,
    instructorName: "Olivia Hayes",
  },
  {
    id: 24,
    title: "Mobile App UI Design Best Practices",
    slug: "mobile-app-ui-design-best-practices",
    durationHours: 8,
    level: "beginner",
    isPublished: true,
    instructorName: "Sophia Reynolds",
  },
  {
    id: 25,
    title: "Excel Power Query & Data Cleaning",
    slug: "excel-power-query-data-cleaning",
    durationHours: 17,
    level: "intermediate",
    isPublished: true,
    instructorName: "Dr. Amelia Scott",
  },
  {
    id: 26,
    title: "Framer Motion: Interactive Micro-animations",
    slug: "framer-motion-interactive-micro-animations",
    durationHours: 13,
    level: "advanced",
    isPublished: true,
    instructorName: "Lucas Bennett",
  },
  {
    id: 27,
    title: "Claude & ChatGPT: Developer Workflow AI",
    slug: "claude-chatgpt-developer-workflow-ai",
    durationHours: 6,
    level: "intermediate",
    isPublished: true,
    instructorName: "Ethan Walker",
  },
  {
    id: 28,
    title: "Build Internal Tools with Retool",
    slug: "build-internal-tools-with-retool",
    durationHours: 15,
    level: "advanced",
    isPublished: false,
    instructorName: "Olivia Hayes",
  },
  {
    id: 29,
    title: "E-commerce UX Audit Blueprint",
    slug: "e-commerce-ux-audit-blueprint",
    durationHours: 9,
    level: "advanced",
    isPublished: true,
    instructorName: "Sophia Reynolds",
  },
  {
    id: 30,
    title: "Predictive Analytics with R: Kickstart",
    slug: "predictive-analytics-with-r-kickstart",
    durationHours: 21,
    level: "advanced",
    isPublished: true,
    instructorName: "Dr. Amelia Scott",
  },
];

export function Courses() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">Orders</h1>
        <Button
          className="cursor-pointer"
          onClick={() => router.push("/admin/courses/new")}
        >
          <PlusIcon aria-hidden="true" className="text-white" size={16} />
          Add new
        </Button>
      </div>

      <DataTable
        defaultPageSize={5}
        columns={courseColumns}
        data={myCoursesData}
      />
    </div>
  );
}
