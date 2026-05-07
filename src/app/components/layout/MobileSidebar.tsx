import { MobileSidebarDrawer } from "@/app/components/ui/MobileSideBarDrawer";
import Link from "next/link";

export function MobileSidebar() {
  return (
    <MobileSidebarDrawer>
      <div className="px-4 py-4">
        <ul>
          <li className="cursor-pointer py-2 px-3">
            <Link
              href="/"
              className="dark:text-creamwhite text-base text-primary hover:text-secondary font-semibold"
            >
              Home
            </Link>
          </li>
          <li className="cursor-pointer py-2 px-3">
            <Link
              href="/"
              className="dark:text-creamwhite text-base text-primary hover:text-secondary font-semibold"
            >
              About us
            </Link>
          </li>{" "}
          <li className="cursor-pointer py-2 px-3">
            <Link
              href="/"
              className="dark:text-creamwhite text-base text-primary hover:text-secondary font-semibold"
            >
              Courses
            </Link>
          </li>{" "}
          <li className="cursor-pointer py-2 px-3">
            <Link
              href="/"
              className="dark:text-creamwhite text-base text-primary hover:text-secondary font-semibold"
            >
              Benefits
            </Link>
          </li>{" "}
          <li className="cursor-pointer py-2 px-3">
            <Link
              href="/"
              className="dark:text-creamwhite text-base text-primary hover:text-secondary font-semibold"
            >
              Pricing
            </Link>
          </li>
          <li className="cursor-pointer py-2 px-3">
            <Link
              href="/"
              className="dark:text-creamwhite text-base text-primary hover:text-secondary font-semibold"
            >
              Blog
            </Link>
          </li>
          <li className="cursor-pointer py-2 px-3">
            <Link
              href="/"
              className="dark:text-creamwhite text-base text-primary hover:text-secondary font-semibold"
            >
              Docs
            </Link>
          </li>
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
            <span className="text-primary text-base font-semibold">
              Sign up
            </span>
          </Link>
        </div>
      </div>
    </MobileSidebarDrawer>
  );
}
