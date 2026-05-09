import DownArrow from "@/assets/images/icon/down-arrow.svg";
import { PillButton } from "../ui/PillButton";

export function HeadLine() {
  return (
    <div className="container">
      <div className="pt-40 pb-16 md:pb-20">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-5">
            <h1 className="">
              Rise to the Top 1% <br /> with Elite Masterclasses
            </h1>
            <p className="text-primary/70 dark:text-creamwhite/70 max-w-lg text-lg leading-[1.4]">
              Learn from experts in product, growth, tech, data, expertly become
              top 1% fast, career-focused, and effectively.
            </p>
          </div>
          <PillButton label="Explore courses" icon={DownArrow} />
        </div>
      </div>
    </div>
  );
}
