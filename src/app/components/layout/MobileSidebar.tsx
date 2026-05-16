"use client";
import { NavItem } from "@/app/components/layout/NavItem";
import Link from "next/link";
import { useState } from "react";
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
            <NavItem data={data} onMounted={onMounted} />
          </li>
        ))}
      </ul>
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
          <span className="text-primary text-base font-semibold">Sign up</span>
        </Link>
      </div>
    </div>
  );
}
