"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card"; // 🌟 Import Card để đóng gói khối
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { UploadCloud, Save, Rocket, Trash2 } from "lucide-react";

export default function CreateCoursePage() {
  return (
    <div className="">
      {/* TOP HEADER ACTION BAR */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold tracking-tight">
            Create New Course
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            className="cursor-pointer gap-2"
            variant="secondary"
            type="button"
          >
            <Trash2 size={15} /> Discard
          </Button>
          <Button
            className="cursor-pointer gap-2"
            variant="outline"
            type="button"
          >
            <Save size={15} /> Save Draft
          </Button>
          <Button className="cursor-pointer gap-2" type="submit">
            <Rocket size={15} /> Publish
          </Button>
        </div>
      </div>

      {/* MAIN FORM CONTAINER */}
      <div className="w-full">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* ================================================================= */}
            {/* CỘT TRÁI (70%): CHỮ CỐT LÕI & TAXONOMY                             */}
            {/* ================================================================= */}
            <div className="lg:col-span-2 space-y-6">
              {/* Card 1: General Information */}
              <Card className="p-6 bg-background border shadow-sm">
                <CardContent className="p-0">
                  <FieldSet>
                    <FieldLegend>General Information</FieldLegend>
                    <FieldDescription>
                      Provide the core setup and written info for your online
                      masterclass
                    </FieldDescription>

                    <FieldGroup>
                      {/* Course Title - Dàn trải full hàng để nhập text dài */}
                      <Field>
                        <FieldLabel htmlFor="course-title">
                          Course Title
                        </FieldLabel>
                        <Input
                          id="course-title"
                          placeholder="e.g. Ultimate Content Creation Mastery"
                          required
                        />
                      </Field>

                      {/* Slug (URL Path) - Dàn trải full hàng nhìn sang trọng hơn */}
                      <Field>
                        <FieldLabel htmlFor="course-slug">
                          Slug (URL Path)
                        </FieldLabel>
                        <Input
                          id="course-slug"
                          placeholder="e.g. ultimate-content-creation-mastery"
                          required
                        />
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="course-desc">
                          Course Description
                        </FieldLabel>
                        <Textarea
                          id="course-desc"
                          placeholder="Write a detailed description about what students will learn in this masterclass..."
                          className="min-h-40 resize-none"
                        />
                        <FieldDescription>
                          Detailed information about the course syllabus,
                          requirements, and target audience.
                        </FieldDescription>
                      </Field>
                    </FieldGroup>
                  </FieldSet>
                </CardContent>
              </Card>

              {/* Card 2: Course Taxonomy - Đã xử lý lấp đầy khoảng trống (Cover Space) */}
              <Card className="p-6 bg-background border shadow-sm">
                <CardContent className="p-0">
                  <FieldSet>
                    <FieldLegend>Course Taxonomy</FieldLegend>
                    <FieldDescription>
                      Classify your course into matching categories and
                      structures
                    </FieldDescription>

                    {/* 🌟 Sử dụng CSS Grid chia đôi 50/50: Category bên trái và Level bên phải */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start pt-2">
                      {/* Category */}
                      <Field>
                        <FieldLabel>Category</FieldLabel>
                        <Select defaultValue="">
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="ai">
                                AI & Automation
                              </SelectItem>
                              <SelectItem value="nocode">
                                No-Code Mastery
                              </SelectItem>
                              <SelectItem value="design">
                                UI/UX Interface
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </Field>

                      {/* Difficulty Level - Đưa xuống đây để triệt tiêu khoảng trống thừa */}
                      <Field>
                        <FieldLabel htmlFor="course-level">
                          Difficulty Level
                        </FieldLabel>
                        <Select defaultValue="">
                          <SelectTrigger id="course-level">
                            <SelectValue placeholder="Select target level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="Beginner">Beginner</SelectItem>
                              <SelectItem value="Intermediate">
                                Intermediate
                              </SelectItem>
                              <SelectItem value="Advanced">Advanced</SelectItem>
                              <SelectItem value="All Levels">
                                All Levels
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </Field>
                    </div>
                  </FieldSet>
                </CardContent>
              </Card>
            </div>

            {/* ================================================================= */}
            {/* CỘT PHẢI (30%): MEDIA, SETTINGS & STATUS                          */}
            {/* ================================================================= */}
            <div className="space-y-6">
              {/* Card 3: Course Media */}
              <Card className="p-6 bg-background border shadow-sm">
                <CardContent className="p-0">
                  <FieldSet>
                    <div className="flex items-center justify-between mb-2">
                      <FieldLegend className="m-0">Course Media</FieldLegend>
                      <button
                        type="button"
                        className="text-sm font-medium text-primary hover:underline cursor-pointer"
                      >
                        Add from URL
                      </button>
                    </div>
                    <FieldGroup>
                      <div className="border border-dashed border-muted-foreground/30 rounded-lg p-8 text-center hover:bg-accent/40 transition cursor-pointer group bg-background">
                        <div className="mx-auto h-10 w-10 rounded-full bg-background flex items-center justify-between border shadow-sm mb-3 group-hover:scale-105 transition">
                          <UploadCloud className="mx-auto h-5 w-5 text-muted-foreground" />
                        </div>
                        <span className="text-sm font-medium block mb-1">
                          Drop your course banner here
                        </span>
                        <span className="text-xs text-muted-foreground block mb-3">
                          PNG or JPG (max. 5MB)
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="cursor-pointer"
                        >
                          Select images
                        </Button>
                      </div>
                    </FieldGroup>
                  </FieldSet>
                </CardContent>
              </Card>

              {/* Card 4: Settings */}
              <Card className="p-6 bg-background border shadow-sm">
                <CardContent className="p-0">
                  <FieldSet>
                    <FieldLegend>Settings</FieldLegend>
                    <FieldGroup>
                      {/* Duration */}
                      <Field>
                        <FieldLabel htmlFor="course-duration">
                          Total Duration (Hours)
                        </FieldLabel>
                        <Input
                          id="course-duration"
                          type="number"
                          placeholder="e.g. 12"
                          required
                        />
                      </Field>

                      {/* Instructor */}
                      <Field>
                        <FieldLabel htmlFor="course-instructor">
                          Assigned Instructor
                        </FieldLabel>
                        <Select defaultValue="">
                          <SelectTrigger id="course-instructor">
                            <SelectValue placeholder="Select instructor" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="inst-1">
                                Ethan Walker
                              </SelectItem>
                              <SelectItem value="inst-2">
                                Olivia Hayes
                              </SelectItem>
                              <SelectItem value="inst-3">
                                Lucas Bennett
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </Field>

                      {/* Checkbox Certificate */}
                      <Field
                        orientation="horizontal"
                        className="pt-2 items-center"
                      >
                        <Checkbox id="course-certificate" />
                        <FieldLabel
                          htmlFor="course-certificate"
                          className="font-normal cursor-pointer"
                        >
                          Include certificate upon completion
                        </FieldLabel>
                      </Field>

                      <FieldSeparator className="my-2" />

                      {/* Switch Open Enrollment */}
                      <Field
                        orientation="horizontal"
                        className="justify-between items-center w-full"
                      >
                        <div className="flex flex-col gap-0.5">
                          <FieldLabel
                            htmlFor="course-enrollment"
                            className="font-medium cursor-pointer"
                          >
                            Open Enrollment
                          </FieldLabel>
                        </div>
                        <Switch id="course-enrollment" defaultChecked />
                      </Field>
                    </FieldGroup>
                  </FieldSet>
                </CardContent>
              </Card>

              {/* Card 5: Status */}
              <Card className="p-6 bg-background border shadow-sm">
                <CardContent className="p-0">
                  <FieldSet>
                    <FieldLegend>Status</FieldLegend>
                    <FieldGroup>
                      <Select defaultValue="draft">
                        <SelectTrigger id="course-status" className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="draft">
                              <span className="inline-flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-orange-500" />
                                Draft
                              </span>
                            </SelectItem>
                            <SelectItem value="published">
                              <span className="inline-flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-green-500" />
                                Published
                              </span>
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FieldDescription>
                        Set the course visibility status.
                      </FieldDescription>
                    </FieldGroup>
                  </FieldSet>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
