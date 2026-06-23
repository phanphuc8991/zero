import { Card } from "@/components/ui/card";
import { Award, CheckCircle2, Clock, PlayCircle } from "lucide-react";
export default function Page() {
  return (
    <div className="text-base">
      <div className="pb-10">
        <h1 className="text-2xl font-bold tracking-tight">My Learning</h1>
        <p className="text-slate-500 text-sm mt-1">
          Track your progress and coutinue learning
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className=" flex flex-row items-center gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-none transition-all duration-200 hover:shadow-md hover:cursor-pointer">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-amber-500/10 text-amber-500">
            <Clock className="w-6 h-6" />
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-slate-500">
              Not Started
            </span>
            <span className="text-2xl font-bold text-slate-800">5</span>
            <span className="text-xs text-slate-400">Courses</span>
          </div>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-md hover:cursor-pointer flex flex-row items-center gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-none">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-500/10 text-blue-600 shrink-0">
            <PlayCircle className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-700 whitespace-nowrap">
              In Progress
            </span>
            <span className="text-2xl font-bold text-slate-900 my-0.5">12</span>
            <span className="text-xs text-slate-400">Courses</span>
          </div>
        </Card>

        <Card className="transition-all duration-200 hover:shadow-md hover:cursor-pointer flex flex-row items-center gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-none ">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-600 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-700 whitespace-nowrap">
              Completed
            </span>
            <span className="text-2xl font-bold text-slate-900 my-0.5">7</span>
            <span className="text-xs text-slate-400">Courses</span>
          </div>
        </Card>

        <Card className=" transition-all duration-200 hover:shadow-md hover:cursor-pointerflex flex-row items-center gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-none">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-purple-500/10 text-purple-600 shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-700 whitespace-nowrap">
              Certificates Earned
            </span>
            <span className="text-2xl font-bold text-slate-900 my-0.5">15</span>
            <span className="text-xs text-slate-400">Certificates</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
