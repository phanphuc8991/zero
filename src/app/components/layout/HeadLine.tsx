import DownArrow from "@/assets/images/icon/down-arrow.svg";
import Image from "next/image";

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

          <a
            href=""
            className="shadow-[0_6px_0_0_rgba(0,0,0,1)] hover:hover:shadow-[0_4px_0_0_rgba(0,0,0,1)] group flex items-center gap-2 bg-secondary hover:bg-transparent dark:hover:bg-creamwhite py-4 px-7 rounded-full border border-black w-fit transition-all duration-300 ease-in-out"
          >
            <span className="font-semibold dark:group-hover:text-primary">
              Explore Courses
            </span>
            <Image
              alt="down-arrow-icon"
              src={DownArrow}
              width={20}
              height={20}
            />
          </a>
        </div>
      </div>
    </div>
  );
}
