"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Pause, Play } from "lucide-react";
import { useState } from "react";
const learningPoints = [
  "Setting up the environment",
  "Understand HTML Programming",
  "Advanced HTML Practices",
  "Code HTML",
  "Build a portfolio website",
  "Start building beautiful websites",
  "Responsive Designs",
];

const courseData: any = [
  {
    id: 1,
    title: "01: Intro",
    totalTime: "22min",
    lessons: [
      { name: "Introduction", time: "2 min" },
      { name: "What is Figma?", time: "5 min" },
    ],
  },
  {
    id: 2,
    title: "02: Intermediate Level Stuff",
    totalTime: "1h 20min",
    lessons: [
      { name: "Working with Components", time: "30 min" },
      { name: "Auto Layout Basics", time: "50 min" },
    ],
  },
  {
    id: 3,
    title: "03: Advanced Stuff",
    totalTime: "36min",
    lessons: [{ name: "Advanced Prototyping", time: "36 min" }],
  },
];

export default function Page() {
  const [activeId, setActiveId] = useState<number | null>(1);

  const toggleAccordion = (id: number) => {
    setActiveId(activeId === id ? null : id);
  };
  return (
    <div className="">
      <h1 className="mb-5 text-xl font-bold tracking-tight lg:text-2xl">
        Mastering Illustration
      </h1>
      <div className="grid gap-4 grid-cols-3">
        <div className="col-span-2 flex flex-col gap-4">
          <div className="relative aspect-video overflow-hidden rounded-xl">
            <video
              poster="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&amp;h=675&amp;fit=crop"
              className="h-full w-full object-cover"
              preload="metadata"
            >
              Your browser does not support the video tag.
            </video>
          </div>
          <Card className="shadow-none px-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              About Course
            </h2>
            <div className="space-y-4 text-[15px] text-slate-600 leading-relaxed font-normal">
              <p>
                Unlock the power of Figma, the leading collaborative design
                tool, with our comprehensive online course. Whether you're a
                novice or looking to enhance your skills, this course will guide
                you through Figma's robust features and workflows.
              </p>
              <p>
                Perfect for UI/UX designers, product managers, and anyone
                interested in modern design tools. Join us to elevate your
                design skills and boost your productivity with Figma!
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-5">
                What You'll Learn
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {learningPoints.map((point, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0 text-[#00b359]">
                      <Check className="w-5 h-5" />
                    </div>
                    <span className="text-[15px] text-slate-700 font-medium leading-normal">
                      {point}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
        <div className="col-span-1 flex flex-col gap-4">
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle>
                <span className="mr-2">Your Study Progress</span>
                <Badge className="gap-1" variant="outline">
                  55%
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="bg-primary/20 relative h-2 w-full overflow-hidden rounded-full">
                <div
                  className="bg-primary h-full"
                  style={{ width: "55%" }}
                ></div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex size-8 items-center justify-center rounded-full text-xs font-medium bg-primary text-primary-foreground">
                  25
                </div>
                <div className="flex size-8 items-center justify-center rounded-full text-xs font-medium bg-primary text-primary-foreground">
                  50
                </div>
                <div className="flex size-8 items-center justify-center rounded-full text-xs font-medium bg-muted text-muted-foreground">
                  75
                </div>
                <div className="flex size-8 items-center justify-center rounded-full text-xs font-medium bg-muted text-muted-foreground">
                  100
                </div>
              </div>
              <div className="bg-muted/50 text-muted-foreground rounded-lg p-3 text-sm">
                Great Job! 🎉 You're on the path to becoming a certified
                Mastering Illustration. Your dedication to learning is
                impressive Finish strong!
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-none overflow-hidden py-0">
            <div className="w-full max-w-125">
              <div className="flex items-center justify-between p-5 border-b border-slate-200 text-slate-900">
                <div className="text-xl font-bold ">Course content</div>
                <div className="text-sm">1/25</div>
              </div>

              <div className="divide-y divide-slate-200">
                {courseData.map((chapter: any) => {
                  const isOpen = activeId === chapter.id;

                  return (
                    <div key={chapter.id} className="w-full">
                      <div
                        onClick={() => toggleAccordion(chapter.id)}
                        className="w-full p-5 flex justify-between items-center hover:bg-slate-50 transition-colors duration-200 text-left group cursor-pointer"
                      >
                        <span className="text-base font-bold text-slate-900">
                          {chapter.title}
                        </span>

                        <div className="flex items-center gap-3 text-sm text-slate-500">
                          <span>{chapter.totalTime}</span>

                          <div
                            className={`flex items-center justify-center w-7 height h-7 border border-slate-200 rounded-md bg-white transition-transform duration-300 ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          >
                            <svg
                              width="12"
                              height="8"
                              viewBox="0 0 12 8"
                              fill="none"
                              className="stroke-slate-900 stroke-2 stroke-linecap-round stroke-linejoin-round"
                            >
                              <path d="M1 1.5L6 6.5L11 1.5" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div
                        className={`grid transition-all duration-300 ease-in-out bg-slate-50 ${
                          isOpen
                            ? "grid-rows-[1fr] opacity-100"
                            : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <div className="w-full max-w-125 mx-auto p-4 flex flex-col gap-3">
                            {chapter.lessons.map((lesson: any, idx: string) => (
                              <Card
                                className="hover: cursor-pointer w-full flex flex-row items-center gap-4 p-5 b roun shadow-none"
                                key={idx}
                              >
                                <div className="flex items-center gap-3">
                                  {/* <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#00cc66] text-white shrink-0">
                                  <Check className="w-4 h-4 stroke-3" />
                                </div>

                                <div className="flex items-center justify-center w-8 h-8  rounded-full bg-black text-white shrink-0">
                                  <Pause className="w-4 h-4" />
                                </div> */}

                                  <div className="flex items-center justify-center w-8 h-8  rounded-full bg-[#f5f5f5] text-slate-800 shrink-0">
                                    <Play className="w-4 h-4" />
                                  </div>
                                  <span>{lesson.name}</span>
                                </div>
                                <span className="text-sm text-slate-500">
                                  {lesson.time}
                                </span>
                              </Card>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
