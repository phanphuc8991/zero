"use client";
import { useState } from "react";
import { NavButton } from "@/app/components/client/nav-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Clock, Play, PlayCircle, Search } from "lucide-react";
import { EnrolledCourseDTO } from "@/features/user/course/contants";

interface EnrolledCoursesListProps {
  initialCourses: EnrolledCourseDTO[];
}

export function ListCourse({ initialCourses }: EnrolledCoursesListProps) {
  const [currentTab, setCurrentTab] = useState<string>("all");
  const [searchText, setSearchText] = useState<string>("");

  const countNotStarted = initialCourses.filter(
    (c) => c.progressStatus === "not-started",
  ).length;
  const countInProgress = initialCourses.filter(
    (c) => c.progressStatus === "in-progress",
  ).length;
  const countCompleted = initialCourses.filter(
    (c) => c.progressStatus === "completed",
  ).length;

  const filteredCourses = initialCourses.filter((course) => {
    const matchesTab =
      currentTab === "all" || course.progressStatus === currentTab;

    const matchesSearch =
      course.title?.toLowerCase().includes(searchText.toLowerCase()) ||
      course.instructor?.name?.toLowerCase().includes(searchText.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="text-base">
      <div className="pb-10">
        <h1 className="text-2xl font-bold tracking-tight">My Learning</h1>
        <p className="text-slate-500 text-sm mt-1">
          Track your progress and coutinue learning
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
        <Card
          onClick={() => setCurrentTab("not-started")}
          className={`flex flex-row items-center gap-4 p-6 shadow-none transition-all duration-200 hover:shadow-md hover:cursor-pointer ${currentTab === "not-started" ? "border-amber-500 bg-amber-500/5" : ""}`}
        >
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-amber-500/10 text-amber-500">
            <Clock className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-slate-500">
              Not Started
            </span>
            <span className="text-2xl font-bold text-slate-800">
              {countNotStarted}
            </span>
            <span className="text-xs text-slate-400">Courses</span>
          </div>
        </Card>

        <Card
          onClick={() => setCurrentTab("in-progress")}
          className={`transition-all duration-200 hover:shadow-md hover:cursor-pointer flex flex-row items-center gap-4 p-6 shadow-none ${currentTab === "in-progress" ? "border-blue-500 bg-blue-500/5" : ""}`}
        >
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-500/10 text-blue-600 shrink-0">
            <PlayCircle className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-700 whitespace-nowrap">
              In Progress
            </span>
            <span className="text-2xl font-bold text-slate-900 my-0.5">
              {countInProgress}
            </span>
            <span className="text-xs text-slate-400">Courses</span>
          </div>
        </Card>

        <Card
          onClick={() => setCurrentTab("completed")}
          className={`transition-all duration-200 hover:shadow-md hover:cursor-pointer flex flex-row items-center gap-4 p-6 shadow-none ${currentTab === "completed" ? "border-emerald-500 bg-emerald-500/5" : ""}`}
        >
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-600 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-700 whitespace-nowrap">
              Completed
            </span>
            <span className="text-2xl font-bold text-slate-900 my-0.5">
              {countCompleted}
            </span>
            <span className="text-xs text-slate-400">Courses</span>
          </div>
        </Card>
      </div>

      <Card className="shadow-none relative px-6 pb-0">
        <div className="absolute left-0 right-0 border border-b top-18.25 w-full bg-muted"></div>

        <div className="absolute right-4 top-5 z-10">
          <InputGroup className="max-w-sm">
            <InputGroupInput
              className="w-200"
              placeholder="Search..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <InputGroupAddon>
              <Search className="w-4 h-4 text-slate-400" />
            </InputGroupAddon>
          </InputGroup>
        </div>

        <Tabs
          value={currentTab}
          onValueChange={(value) => setCurrentTab(value)}
        >
          <TabsList variant="line">
            <TabsTrigger className="p-7 hover:cursor-pointer" value="all">
              All
            </TabsTrigger>
            <TabsTrigger
              className="p-7 hover:cursor-pointer"
              value="not-started"
            >
              Not Started
            </TabsTrigger>
            <TabsTrigger
              className="p-7 hover:cursor-pointer"
              value="in-progress"
            >
              In Progress
            </TabsTrigger>
            <TabsTrigger className="p-7 hover:cursor-pointer" value="completed">
              Completed
            </TabsTrigger>
          </TabsList>

          <div className="mt-8 mb-7 min-h-100 flex flex-col gap-10">
            {filteredCourses.length === 0 ? (
              <div className="text-slate-400 text-sm text-center py-20">
                No courses found matching this criteria.
              </div>
            ) : (
              <div>
                <TabsContent value={currentTab}>
                  <div className="grid grid-cols-4 gap-4">
                    {filteredCourses.map((course) => (
                      <Card
                        key={course.id}
                        className="relative gap-4 py-6 max-w-sm shadow-none pt-0 overflow-hidden bg-slate-50/50"
                      >
                        <div className="left-2 top-2 absolute z-10 flex gap-1">
                          {course.progressStatus === "not-started" && (
                            <Badge className="bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0] rounded px-2.5 py-0.5 text-[11px] font-semibold border-none shadow-none">
                              Not Started
                            </Badge>
                          )}
                          {course.progressStatus === "in-progress" && (
                            <Badge className="bg-[#e0f2fe] text-[#0369a1] hover:bg-[#bae6fd] rounded px-2.5 py-0.5 text-[11px] font-semibold border-none shadow-none">
                              In Progress
                            </Badge>
                          )}
                          {course.progressStatus === "completed" && (
                            <Badge className="bg-[#dcfce7] text-[#15803d] hover:bg-[#bbf7d0] rounded px-2.5 py-0.5 text-[11px] font-semibold border-none shadow-none">
                              Completed
                            </Badge>
                          )}
                        </div>
                        <CardContent className="px-0">
                          <div className="w-full h-45">
                            <img
                              src={course?.thumbnailUrl || ""}
                              alt={course.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </CardContent>

                        <CardHeader>
                          <CardTitle className="leading-snug line-clamp-2">
                            {course.title}
                          </CardTitle>
                          <CardDescription>
                            <div className="flex items-center gap-3">
                              <Avatar className="w-5 h-5">
                                <AvatarImage
                                  src={
                                    course?.instructor?.avatarUrl ||
                                    "https://github.com/shadcn.png"
                                  }
                                  alt={course.instructor?.name}
                                />
                                <AvatarFallback>CN</AvatarFallback>
                              </Avatar>
                              <div>
                                {course.instructor?.name || "Instructor"}
                              </div>
                            </div>
                          </CardDescription>
                        </CardHeader>

                        <CardFooter className="flex flex-col gap-4">
                          <div className="flex w-full max-w-sm items-center gap-2">
                            <Progress
                              value={course?.progressPercentage}
                              className="bg-green-500/20 [&>div]:bg-green-500"
                            />
                            <span className="text-muted-foreground text-sm">
                              {course?.progressPercentage}%
                            </span>
                          </div>

                          <NavButton
                            className="aspect-square w-full"
                            to={`/user/courses/${course.slug}`}
                          >
                            <Play
                              aria-hidden="true"
                              className="opacity-60 sm:-ms-1"
                              size={16}
                            />
                            Continue Learning
                          </NavButton>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </div>
            )}
          </div>
        </Tabs>
      </Card>
    </div>
  );
}
