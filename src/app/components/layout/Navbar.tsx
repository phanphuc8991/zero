import Link from "next/link";
import Image from "next/image";
import { MobileSidebar } from "./MobileSidebar";
import DarkLogo from "@/assets/images/logo/dark-logo.svg";
import LightLogo from "@/assets/images/logo/light-logo.svg";
import SunIcon from "@/assets/images/dark-light-icon/sun-icon.svg";
import MoonIcon from "@/assets/images/dark-light-icon/moon-icon.svg";
export function Navbar() {
  return (
    <nav className="py-3.5 flex justify-between animation-navbar bg-creamwhite">
      <div className="flex items-center">
        <Link href="/">
          <Image
            alt="logo"
            src={LightLogo}
            width={190}
            height={34}
            className="dark:hidden h-auto w-auto"
            loading="eager"
          />
          <Image
            alt="logo"
            src={DarkLogo}
            width={190}
            height={34}
            className="hidden dark:block h-auto w-auto"
            loading="eager"
          />
        </Link>
      </div>
      <div className="hidden lg:flex items-center gap-6">
        <ul className="flex items-center gap-5">
          <li className="cursor-pointer">
            <Link
              href="/"
              className="dark:text-creamwhite text-base text-primary hover:text-secondary font-semibold"
            >
              Home
            </Link>
          </li>
          <li className="cursor-pointer">
            <Link
              href="/#about-us"
              className="dark:text-creamwhite text-base text-primary hover:text-secondary font-semibold"
            >
              About us
            </Link>
          </li>{" "}
          <li className="cursor-pointer">
            <Link
              href="/courses"
              className="dark:text-creamwhite text-base text-primary hover:text-secondary font-semibold"
            >
              Courses
            </Link>
          </li>{" "}
          <li className="cursor-pointer">
            <Link
              href="/#benefits"
              className="dark:text-creamwhite text-base text-primary hover:text-secondary font-semibold"
            >
              Benefits
            </Link>
          </li>{" "}
          <li className="cursor-pointer">
            <Link
              href="/#pricing"
              className="dark:text-creamwhite text-base text-primary hover:text-secondary font-semibold"
            >
              Pricing
            </Link>
          </li>
          <li className="cursor-pointer">
            <Link
              href="/blog"
              className="dark:text-creamwhite text-base text-primary hover:text-secondary font-semibold"
            >
              Blog
            </Link>
          </li>
          <li className="cursor-pointer">
            <Link
              href="/"
              className="dark:text-creamwhite text-base text-primary hover:text-secondary font-semibold"
            >
              Docs
            </Link>
          </li>
        </ul>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <Link
              href=""
              className="group border border-primary py-2 px-5 rounded-full cursor-pointer dark:border-creamwhite dark:hover:border-primary hover:bg-secondary"
            >
              <span className="text-base font-semibold text-primary dark:text-creamwhite dark:group-hover:text-primary">
                Sign in
              </span>
            </Link>
            <Link
              href=""
              className="border border-primary py-2 px-5 rounded-full cursor-pointer bg-secondary hover:bg-transparent dark:hover:bg-creamwhite"
            >
              <span className="text-primary text-base font-semibold">
                Sign up
              </span>
            </Link>
          </div>
          <button className="group flex justify-center items-center w-8 h-8">
            <span className="group-hover:rotate-180 transition-transform duration-700 ease-in-out cursor-pointer">
              <Image
                alt="icon"
                src={SunIcon}
                width={25}
                height={25}
                className="hidden dark:block w-6.25 h-6.25 "
              />
              <Image
                alt="icon"
                src={MoonIcon}
                width={25}
                height={25}
                className="dark:hidden w-6.25 h-6.25 "
              />
            </span>
          </button>
        </div>
      </div>
      <MobileSidebar />
    </nav>
  );
}
