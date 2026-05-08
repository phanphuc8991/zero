import DownArrow from "@/assets/images/icon/down-arrow.svg";
import Image from "next/image";
import Link from "next/link";
import image_1 from "@/assets/images/home/profile-img-1.png";
export default function HomePage() {
  return (
    <>
      <section className="">
        <div className="container">
          <div className="pt-40 pb-16 md:pb-20">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-5">
                <h1 className="">
                  Rise to the Top 1% <br /> with Elite Masterclasses
                </h1>
                <p className="text-primary/70 dark:text-creamwhite/70 max-w-lg text-lg leading-[1.4]">
                  Learn from experts in product, growth, tech, data, expertly
                  become top 1% fast, career-focused, and effectively.
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
        <div id="parent" className="relative w-full h-auto">
          <div id="child" className="flex items-center">
            <div className="w-[350px]">
              <div className="group relative">
                <Link
                  href=""
                  className="rounded-3xl overflow-hidden block w-80 h-105 relative overflow-hidden"
                >
                  <Image
                    alt="Ethan Walker"
                    src={image_1}
                    fill
                    sizes="350px"
                    className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                  />
                </Link>

                <div className="absolute flex flex-col gap-4 p-6 bottom-0">
                  <Link href="">
                    <h5 className="text-white group-hover:text-secondary">Ethan Walker</h5>
                  </Link>
                  <p className="text-white font-normal py-2 px-5 border border-white rounded-full">
                    Al Content Strategist
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
