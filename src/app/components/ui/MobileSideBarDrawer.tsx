"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import DarkMenuIcon from "@/assets/images/icon/verticle-dark-menu.svg";
import LightMenuIcon from "@/assets/images/icon/verticle-light-menu.svg";
import DarkCloseIcon from "@/assets/images/icon/close-dark-icon.svg";
import LightCloseIcon from "@/assets/images/icon/close-light-icon.svg";
import SunIcon from "@/assets/images/dark-light-icon/sun-icon.svg";
import MoonIcon from "@/assets/images/dark-light-icon/moon-icon.svg";

export function MobileSidebarDrawer({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);
  return (
    <>
      <div className="lg:hidden flex items-center gap-4">
        <button className="group flex justify-center items-center w-8 h-8">
          <span className="group-hover:rotate-180 transition-transform duration-700 ease-in-out cursor-pointer">
            <Image
              alt="icon"
              src={SunIcon}
              width={25}
              height={25}
              className="hidden dark:block w-6.25 h-6.25"
            />
            <Image
              alt="icon"
              src={MoonIcon}
              width={25}
              height={25}
              className="dark:hidden w-6.25 h-6.25"
            />
          </span>
        </button>
        <button className="cursor-pointer" onClick={onOpen}>
          <Image
            alt="menu-icon"
            src={DarkMenuIcon}
            width={30}
            height={30}
            className="hidden dark:block w-7.5 h-7.5"
          />
          <Image
            alt="menu-icon"
            src={LightMenuIcon}
            width={30}
            height={30}
            className="w-7.5 h-7.5"
          />
        </button>
      </div>

      <div
        className={cn(
          "lg:hidden fixed top-0 right-0 w-full h-full bg-creamwhite dark:bg-primary shadow-lg max-w-xs z-50 transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex justify-between items-center px-5 py-4">
          <span className="text-primary font-bold dark:creamwhite leading-[140%] text-lg">
            Menu
          </span>
          <button className="cursor-pointer" onClick={onClose}>
            <Image
              alt="menu-close-icon"
              src={DarkCloseIcon}
              width={25}
              height={25}
              className="hidden dark:block w-6.25 h-6.25"
            />
            <Image
              alt="menu-close-icon"
              src={LightCloseIcon}
              width={25}
              height={25}
              className="w-6.25 h-6.25"
            />
          </button>
        </div>
        {children}
      </div>

      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 backdrop-blur-xs",
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
      ></div>
    </>
  );
}
