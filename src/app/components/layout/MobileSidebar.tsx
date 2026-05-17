"use client";
import { NavItem } from "@/app/components/layout/NavItem";
import Link from "next/link";
import * as Avatar from "@radix-ui/react-avatar";
import { Suspense } from "react";
const navItem = [
  {
    href: "/",
    text: "Home",
  },
  {
    href: "/#about-us",
    text: "About us",
  },
  {
    href: "/courses",
    text: "Courses",
  },
  {
    href: "/#benefits",
    text: "Benefits",
  },
  {
    href: "/#pricing",
    text: "Pricing",
  },
  {
    href: "/blog",
    text: "Blog",
  },
  {
    href: "/docs",
    text: "Docs",
  },
];
export function MobileSidebar({
  onClose,
  onMounted,
  mounted,
}: {
  onClose: any;
  mounted: any;
  onMounted: any;
}) {
  return (
    <div className="px-4 py-4">
      <ul
        className={`transition-opacity  duration-450 ${mounted ? "opacity-100" : "opacity-0"}`}
      >
        {navItem.map((data, index) => (
          <li
            key={index}
            className="cursor-pointer py-2 px-3"
            onClick={() => {
              onClose();
            }}
          >
            <Suspense fallback={null}>
              <NavItem data={data} onMounted={onMounted} />
            </Suspense>
          </li>
        ))}
      </ul>
      {false && (
        <div className="flex flex-col gap-3 my-2">
          <Link
            href="/"
            className="group border border-primary dark:hover:border-primary dark:border-creamwhite hover:bg-secondary py-2 px-5 rounded-full cursor-pointer"
          >
            <span className="text-primary dark:text-creamwhite dark:group-hover:text-primary text-base font-semibold">
              Sign in
            </span>
          </Link>

          <Link
            href="/"
            className="border border-primary bg-secondary hover:bg-transparent dark:hover:bg-creamwhtie py-2 px-5 rounded-full cursor-pointer"
          >
            <span className="text-primary text-base font-semibold">
              Sign up
            </span>
          </Link>
        </div>
      )}
      <div className="flex flex-col gap-3 my-2">
        <Link
          href="/"
          className="border border-primary bg-secondary hover:bg-transparent dark:hover:bg-creamwhtie py-2 px-5 rounded-full cursor-pointer"
        >
          <span className="text-primary text-base font-semibold">Sign Out</span>
        </Link>
        <div className="flex pr-2 pl-2 py-1.5 rounded-full justify-start gap-1 items-center border border-primary">
          <Avatar.Root className="inline-flex h-8 select-none items-center justify-center rounded-full bg-blackA1 align-middle flex-1">
            <Avatar.Image
              className="size-full rounded-[inherit] object-cover"
              src="./avatar_1.jpg"
              alt="Colm Tuite"
            />
            <Avatar.Fallback
              className="leading-1 flex size-full items-center justify-center bg-white text-[15px] font-medium text-violet11"
              delayMs={600}
            >
              CT
            </Avatar.Fallback>
          </Avatar.Root>
          <span className="text-sm flex flex-wrap font-semibold text-black dark:text-creamwhite  w-58">
            phanhoangphuc8991@gmail.com
          </span>
        </div>
      </div>
    </div>
  );
}
