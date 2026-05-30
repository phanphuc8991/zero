"use client";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Loader2, UserPlus } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import DataTable from "@/components/data-table/data-table";
import {
  InstructorFormInput,
  instructorFormSchema,
} from "@/features/courses/contants";
import { newInstructorAction } from "@/features/courses/actions";
import { instructorColumns } from "@/components/data-table/instructor-columns";

const mockInstructors: any = [
  {
    id: 1,
    name: "Ethan Walker",
    title: "AI Content Expert",
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
    bio: "Over 8 years of experience in digital media and automating content production pipelines using cutting-edge AI tools.",
  },
  {
    id: 2,
    name: "Olivia Hayes",
    title: "No-Code SaaS Architect",
    avatarUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80",
    bio: "Specializes in building enterprise automation systems and deploying scalable SaaS products completely code-free.",
  },
  {
    id: 3,
    name: "Lucas Bennett",
    title: "Product Designer & Webflow Expert",
    avatarUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80",
    bio: "Passionate about interactive UI and turning high-fidelity Figma designs into pixel-perfect production-ready websites.",
  },
  {
    id: 4,
    name: "Sophia Reynolds",
    title: "Product Designer",
    avatarUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&h=150&q=80",
    bio: "Expert in auditing complex e-commerce conversion funnels and mentoring teams on design system architecture.",
  },
  {
    id: 5,
    name: "Dr. Amelia Scott",
    title: "Data Scientist",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
    bio: "Ph.D. in Data Science with a core focus on translating deep analytics and warehouse data into actionable business growth.",
  },
];

const instructorsFilters = [
  {
    columnId: "title",
    title: "Specialty",
    options: [
      { value: "AI", label: "Artificial Intelligence (AI)" },
      { value: "No-Code", label: "No-Code Architect" },
      { value: "Designer", label: "Product Design" },
      { value: "Data", label: "Data Science" },
    ],
  },
];

export default function Instructors() {
  const [instructorsData, setInstructorsData] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serverError, setServerError] = useState("");

  const loadInstructors = async () => {
    try {
      setInstructorsData(mockInstructors);
    } catch (err) {
      console.error("Failed to load instructors:", err);
    }
  };

  useEffect(() => {
    loadInstructors();
  }, []);

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<InstructorFormInput>({
    resolver: zodResolver(instructorFormSchema),
    defaultValues: { name: "", title: "", avatarUrl: "", bio: "" },
  });

  const { execute, isExecuting } = useAction(newInstructorAction, {
    onError: ({ error }) => {
      setServerError(error?.serverError as string);
    },
    onSuccess: () => {
      setServerError("");
      setIsModalOpen(false);
      reset();
      loadInstructors();
    },
  });

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">Instructors</h1>

        <Dialog
          open={isModalOpen}
          onOpenChange={(open) => {
            setIsModalOpen(open);
            if (!open) {
              reset();
              setServerError("");
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="gap-2 cursor-pointer">
              <UserPlus size={16} /> Add new
            </Button>
          </DialogTrigger>
          <DialogContent
            className="sm:max-w-120"
            onInteractOutside={(e) => e.preventDefault()}
            onEscapeKeyDown={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle>New Instructor</DialogTitle>
              <DialogDescription className="sr-only">
                Create a professional profile for a new course instructor.
              </DialogDescription>
            </DialogHeader>

            {serverError && (
              <div
                role="alert"
                aria-live="assertive"
                className="p-3 bg-destructive/10 border border-destructive text-destructive rounded-md text-xs font-medium"
              >
                Error: {serverError}
              </div>
            )}

            <form
              onSubmit={handleSubmit((data) => execute(data))}
              className="space-y-4 pt-2"
            >
              <Field>
                <FieldLabel htmlFor="modal-ins-name">Full Name</FieldLabel>
                <div>
                  <Controller
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="modal-ins-name"
                        placeholder="e.g. Ethan Walker"
                        aria-invalid={!!errors.name}
                      />
                    )}
                  />
                  {errors.name && (
                    <p
                      aria-live="polite"
                      role="alert"
                      className="text-destructive text-xs mt-2"
                    >
                      {errors.name.message}
                    </p>
                  )}
                </div>
              </Field>
              <Field>
                <FieldLabel htmlFor="modal-ins-title">
                  Professional Title
                </FieldLabel>
                <div>
                  <Controller
                    control={control}
                    name="title"
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="modal-ins-title"
                        placeholder="e.g. AI Content Strategist"
                        aria-invalid={!!errors.title}
                      />
                    )}
                  />
                  {errors.title && (
                    <p
                      aria-live="polite"
                      role="alert"
                      className="text-destructive text-xs mt-2"
                    >
                      {errors.title.message}
                    </p>
                  )}
                </div>
              </Field>

              <Field>
                <FieldLabel htmlFor="modal-ins-avatar">
                  Avatar Image URL
                </FieldLabel>
                <div>
                  <Controller
                    control={control}
                    name="avatarUrl"
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="modal-ins-avatar"
                        placeholder="https://images.unsplash.com/..."
                        aria-invalid={!!errors.avatarUrl}
                      />
                    )}
                  />
                  {errors.avatarUrl && (
                    <p
                      aria-live="polite"
                      role="alert"
                      className="text-destructive text-xs mt-1"
                    >
                      {errors.avatarUrl.message}
                    </p>
                  )}
                </div>
              </Field>

              <Field>
                <FieldLabel htmlFor="modal-ins-bio">Biography (Bio)</FieldLabel>
                <Controller
                  control={control}
                  name="bio"
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      id="modal-ins-bio"
                      placeholder="Brief summary about their industry experience and teaching background..."
                      className="min-h-24 resize-none"
                    />
                  )}
                />
              </Field>

              <div className="flex justify-end pt-2">
                <Button type="submit" disabled={isExecuting} className="gap-2">
                  {isExecuting ? (
                    <Loader2 className="animate-spin" size={15} />
                  ) : (
                    <Save size={15} />
                  )}
                  Save
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        defaultPageSize={10}
        searchColumn="name"
        columns={instructorColumns}
        data={instructorsData}
        filters={instructorsFilters}
      />
    </div>
  );
}
