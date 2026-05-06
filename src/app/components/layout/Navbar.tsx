import Link from "next/link";
import Image from "next/image";
export function Navbar() {
  return (
    <nav className="py-3.5 flex justify-between transition-all duration-300 ease-in-out">
      <div className="flex items-center">
        <Link href="/">
          <Image
            alt="logo"
            src="/images/logo/light-logo.svg"
            width={190}
            height={34}
            className="dark:hidden"
            style={{ width: "auto", height: "auto" }}
            priority
          />
          <Image
            alt="logo"
            src="/images/logo/dark-logo.svg"
            width={190}
            height={34}
            className="hidden dark:block"
            style={{ width: "auto", height: "auto" }}
            priority
          />
        </Link>
      </div>
      <div className="hidden lg:flex items-center gap-6">
        <ul className="flex items-center gap-5">
          <li className="cursor-pointer">
            <Link
              href="/"
              className="dark:text-creamwhite text-base text-primary hover:text-secondary font-bold"
            >
              Home
            </Link>
          </li>
          <li className="cursor-pointer">
            <Link
              href="/"
              className="dark:text-creamwhite text-base text-primary hover:text-secondary font-bold"
            >
              About us
            </Link>
          </li>
          <li className="cursor-pointer">
            <Link
              href="/"
              className="dark:text-creamwhite text-base text-primary hover:text-secondary font-bold"
            >
              About us
            </Link>
          </li>{" "}
          <li className="cursor-pointer">
            <Link
              href="/"
              className="dark:text-creamwhite text-base text-primary hover:text-secondary font-bold"
            >
              Courses
            </Link>
          </li>{" "}
          <li className="cursor-pointer">
            <Link
              href="/"
              className="dark:text-creamwhite text-base text-primary hover:text-secondary font-bold"
            >
              Benefits
            </Link>
          </li>{" "}
          <li className="cursor-pointer">
            <Link
              href="/"
              className="dark:text-creamwhite text-base text-primary hover:text-secondary font-bold"
            >
              Pricing
            </Link>
          </li>
          <li className="cursor-pointer">
            <Link
              href="/"
              className="dark:text-creamwhite text-base text-primary hover:text-secondary font-bold"
            >
              Blog
            </Link>
          </li>
          <li className="cursor-pointer">
            <Link
              href="/"
              className="dark:text-creamwhite text-base text-primary hover:text-secondary font-bold"
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
              <span className="text-base font-bold text-primary dark:text-creamwhite dark:group-hover:text-primary">
                Sign in
              </span>
            </Link>
            <Link
              href=""
              className="border border-primary py-2 px-5 rounded-full cursor-pointer bg-secondary hover:bg-transparent dark:hover:bg-creamwhite"
            >
              <span className="text-primary text-base font-bold">Sign up</span>
            </Link>
          </div>
          <button className="flex justify-center items-center w-8 h-8 transition-transform duration-700 ease-in-out">
            <span>
              <Image
                alt="icon"
                src="/images/dark-light-icon/sun-icon.svg"
                width={25}
                height={25}
              />
              <Image
                alt="icon"
                src="/images/dark-light-icon/moon-icon.svg"
                width={25}
                height={25}
              />
            </span>
          </button>
        </div>
      </div>
      <div className="lg:hidden">3</div>
    </nav>
  );
}
