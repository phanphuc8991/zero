"use client";
import Link from "next/link";
import Image from "next/image";
import DarkLogo from "@/assets/images/logo/dark-logo.svg";
import LightLogo from "@/assets/images/logo/light-logo.svg";
import GoogleIcon from "@/assets/images/icon/google-icon.svg";
import GitHubIcon from "@/assets/images/icon/github-icon.svg";

export default function Page() {
  return (
    <section>
      <div className="container">
        <div className="pt-32 sm:pt-44 pb-16 sm:pb-28 flex justify-center items-center">
          <div className="max-w-lg shadow-2xl rounded-2xl bg-creamwhite dark:bg-primary px-6 py-12 sm:px-12 md:px-16 flex-1">
            <div className="mb-10 flex justify-center">
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
            <div className="">
              <div className="mb-5">
                <div className="flex items-baseline justify-between">
                  <div className="text-[15px] font-medium leading-8.75 text-primary">
                    Email
                  </div>
                  <div className="text-[13px] text-primary opacity-80">
                    Please enter your email
                  </div>
                  <div className="text-[13px] text-primary opacity-80">
                    Please provide a valid email
                  </div>
                </div>
                <div>
                  <input
                    className="w-full rounded-full border border-primary/20 outline-none px-5 py-3 text-primary dark:text-creamwhite dark:border-stroke focus:border-primary/60 dark:focus:border-creamwhite/60 data-[invalid=true]:border-red-500"
                    type="text"
                    required
                    id="email"
                    name="email"
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className="mb-9">
                <button className="h-auto shadow-[0_6px_0_0_rgba(0,0,0,1)] hover:hover:shadow-[0_4px_0_0_rgba(0,0,0,1)] group flex items-center justify-center gap-2 bg-secondary hover:bg-transparent dark:hover:bg-creamwhite py-3 px-5 rounded-full border border-black w-full transition-all duration-300 ease-in-out">
                  <span>Send Email</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
