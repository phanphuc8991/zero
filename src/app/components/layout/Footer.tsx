import Link from "next/link";
import DarkLogo from "@/assets/images/logo/dark-logo.svg";
import Image from "next/image";
import Instagram from "@/assets/images/icon/instagram.svg";
import Facebook from "@/assets/images/icon/facebook.svg";
import Twitter from "@/assets/images/icon/twitter.svg";
import Linkedin from "@/assets/images/icon/linkedin.svg";

export function Footer() {
  return (
    <div className="relative bg-primary pt-24 z-10">
      <div className="container">
        <div className="flex flex-col justify-between gap-12 pb-8  lg:flex-row border-b border-white/20 lg:items-center md:pb-14">
          <div className="flex flex-col gap-2 max-w-md">
            <h5 className="text-white">Unlock What’s Hidden ✨</h5>
            <p className="text-white/70 ">
              Get early access to exclusive programs, workshops, and events.
              Stay updated with industry news and reports.
            </p>
          </div>
          <form
            action=""
            className="flex flex-col sm:flex-row flex-1 sm:items-center lg:justify-end justify-start gap-4 w-full"
          >
            <input
              className="border border-white/70 rounded-full py-3 px-8 text-white/70"
              type="text"
              name="email"
              placeholder="Enter your email"
            />
            <button
              className="cursor-pointer bg-secondary hover:bg-white text-primary font-semibold py-3 px-7 rounded-full border border-b-6 border-black"
              type="submit"
            >
              Subscribe
            </button>
          </form>
        </div>
        <div className="py-8 md:py-16 flex flex-col lg:flex-row gap-10 lg:gap-0 justify-between">
          <div className="flex flex-col gap-8">
            <Image
              width={198}
              height={48}
              src={DarkLogo}
              alt=""
              className="w-49.5 h-12"
            />

            <div className="flex items-center gap-4">
              <Link
                href=""
                className="bg-white/20 hover:bg-secondary/90 p-3.5 rounded-full"
              >
                <Image
                  alt="social icon"
                  src={Instagram}
                  width={20}
                  height={20}
                />
              </Link>
              <Link
                href=""
                className="bg-white/20 hover:bg-secondary/90 p-3.5 rounded-full"
              >
                <Image
                  alt="social icon"
                  src={Facebook}
                  width={20}
                  height={20}
                />
              </Link>{" "}
              <Link
                href=""
                className="bg-white/20 hover:bg-secondary/90 p-3.5 rounded-full"
              >
                <Image alt="social icon" src={Twitter} width={20} height={20} />
              </Link>{" "}
              <Link
                href=""
                className="bg-white/20 hover:bg-secondary/90 p-3.5 rounded-full"
              >
                <Image
                  alt="social icon"
                  src={Linkedin}
                  width={20}
                  height={20}
                />
              </Link>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between xl:gap-16 md:gap-10 gap-7">
            <div className="flex flex-col gap-4">
              <h6 className="text-white font-medium">Contact info</h6>
              <div className="flex flex-col gap-2 md:gap-3 max-w-47.5">
                <Link href="">
                  <h6 className="text-white/70 hover:text-secondary">
                    29 Avenue Reine 1190, Brussels, Belgium
                  </h6>
                </Link>
                <Link href="">
                  <h6 className="text-white/70 hover:text-secondary">
                    0105 192 3556
                  </h6>
                </Link>
                <Link href="">
                  <h6 className="text-white/70 hover:text-secondary">
                    hello@learnaxis.com
                  </h6>
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h6 className="text-white font-medium">Courses</h6>
              <div className="flex flex-col gap-2 md:gap-3">
                <Link href="">
                  <h6 className="text-white/70 hover:text-secondary">
                    Marketing Masterclass
                  </h6>
                </Link>
                <Link href="">
                  <h6 className="text-white/70 hover:text-secondary">
                    Framer Masterclass
                  </h6>
                </Link>
                <Link href="">
                  <h6 className="text-white/70 hover:text-secondary">
                    Growth Masterclass
                  </h6>
                </Link>
                <Link href="">
                  <h6 className="text-white/70 hover:text-secondary">
                    Data Visualisation Masterclass
                  </h6>
                </Link>
                <Link href="">
                  <h6 className="text-white/70 hover:text-secondary">
                    UI/UX Design Masterclass
                  </h6>
                </Link>
                <Link href="">
                  <h6 className="text-white/70 hover:text-secondary">
                    AI Content Creation Masterclass
                  </h6>
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-4 ">
              <h6 className="text-white font-medium">Useful Links</h6>
              <div className="flex flex-col gap-2 md:gap-3 max-w-47.5">
                <Link href="">
                  <h6 className="text-white/70 hover:text-secondary">
                    About us
                  </h6>
                </Link>
                <Link href="">
                  <h6 className="text-white/70 hover:text-secondary">
                    Courses
                  </h6>
                </Link>
                <Link href="">
                  <h6 className="text-white/70 hover:text-secondary">
                    Testimonials
                  </h6>
                </Link>
                <Link href="">
                  <h6 className="text-white/70 hover:text-secondary">
                    Benefits
                  </h6>
                </Link>

                <Link href="">
                  <h6 className="text-white/70 hover:text-secondary">
                    Pricing
                  </h6>
                </Link>

                <Link href="">
                  <h6 className="text-white/70 hover:text-secondary">Blog</h6>
                </Link>

                <Link href="">
                  <h6 className="text-white/70 hover:text-secondary">
                    Error 404
                  </h6>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row items-center lg:justify-between py-6 gap-1.5 border-t border-white/20">
          <p className="text-center text-white/70">
            <span>© 2025 Learnaxis - Design & Developed by </span>
            <Link href="" className="hover:text-secondary">
              Getnextjstemplates
            </Link>
          </p>
          <div className="flex items-center justify-center flex-wrap">
            <div className="flex items-center">
              <Link href="">
                <p className="text-white/70 text-base hover:text-secondary">
                  Privacy Policy
                </p>
              </Link>
              <span className="mx-1 sm:mx-4 text-white/40">•</span>
            </div>
            <div className="flex items-center">
              <Link href="">
                <p className="text-white/70 text-base hover:text-secondary">
                  Terms & Conditions
                </p>
              </Link>
              <span>•</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
