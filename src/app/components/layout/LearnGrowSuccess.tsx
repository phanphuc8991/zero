import GrowLightIcon from "@/assets/images/icon/grow-light-icon.svg";
import GrowDarkIcon from "@/assets/images/icon/grow-dark-icon.svg";
import Image from "next/image";
import { PillButton } from "@/app/components/ui/PillButton";

import PlayDarkIcon from "@/assets/images/icon/play-dark-icon.svg";
import PlayLightIcon from "@/assets/images/icon/play-light-icon.svg";
import Link from "next/link";
import CourseItemImage1 from "@/assets/images/courses/courses_img-1.png";
import CourseItemImage2 from "@/assets/images/courses/courses_img-2.jpeg";
import CourseItemImage3 from "@/assets/images/courses/courses_img-3.jpeg";
import CourseItemImage4 from "@/assets/images/courses/courses_img-4.jpeg";

import image_1 from "@/assets/images/home/profile-img-1.png";
import image_2 from "@/assets/images/home/profile-img-2.png";
import image_3 from "@/assets/images/home/profile-img-3.png";
import image_4 from "@/assets/images/home/profile-img-4.png";

const listCourse = [
  {
    coverImage: CourseItemImage1,
    title: "Ultimate Content Creation Mastery",
    duration: "12",
    instructor: {
      name: "Ethan Walker",
      title: "AI Content Strategist",
      avatar: image_1,
    },
  },
  {
    coverImage: CourseItemImage2,
    title: "Ultimate Content Creation Mastery",
    duration: "12",
    instructor: {
      name: "Ethan Walker",
      title: "AI Content Strategist",
      avatar: image_2,
    },
  },
  {
    coverImage: CourseItemImage3,
    title: "Ultimate Content Creation Mastery",
    duration: "12",
    instructor: {
      name: "Ethan Walker",
      title: "AI Content Strategist",
      avatar: image_3,
    },
  },
  {
    coverImage: CourseItemImage4,
    title: "Ultimate Content Creation Mastery",
    duration: "12",
    instructor: {
      name: "Ethan Walker",
      title: "AI Content Strategist",
      avatar: image_4,
    },
  },
];
export function LearnGrowSuccess() {
  return (
    <div className="container">
      <div className="py-11 md:py-20 flex flex-col gap-10 md:gap-12">
        <div className="flex flex-col items-center gap-7 xl:gap-12 lg:mb-60">
          <div className="flex flex-col items-center gap-4 text-center">
            <Image
              src={GrowLightIcon}
              alt="icon"
              width={48}
              height={48}
              className="w-12 h-12 dark:hidden"
            />
            <Image
              src={GrowDarkIcon}
              alt="icon"
              width={48}
              height={48}
              className="w-12 h-12 hidden dark:block"
            />
            <h2>Learn, Grow, and Succeed.</h2>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-5 ">
            <div className="w-fit">
              <PillButton label="Join for Free" />
            </div>
            <div>
              <a
                href=""
                className="h-auto shadow-[0_6px_0_0_rgba(0,0,0,1)] hover:hover:shadow-[0_4px_0_0_rgba(0,0,0,1)] group flex items-center justify-center gap-2 bg-transparent dark:bg-middlegreen dark:hover:bg-creamwhit py-4 px-7 rounded-full border border-black w-fit transition-all duration-300 ease-in-out"
              >
                <span className="font-semibold dark:group-hover:text-primary">
                  Explore Courses
                </span>
              </a>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="lg:absolute lg:-top-56  grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 sm:gap-0 gap-4">
            {listCourse.map((data, index) => (
              <div
                key={index}
                className={`hover:z-20 hover:rotate-0 ${index % 2 ? "sm:rotate-6" : "sm:sm:rotate-[-5.36deg]"} grou border-primary/20 shadow-lg dark:border-creamwhite/20 border rounded-2xl flex flex-col  transition-transform duration-500 ease-in-out bg-creamwhite dark:bg-middlegreen will-change-transform transform`}
              >
                <div className="">
                  <Link href="" className="h-48 block">
                    <Image
                      src={data.coverImage}
                      alt="course-item-image"
                      width={364}
                      height={210}
                      className="object-cover w-full h-full rounded-2xl"
                      loading="eager"
                    />
                  </Link>
                </div>
                <div className="p-6 flex flex-col justify-center flex-1">
                  <div className="flex flex-col justify-center gap-4">
                    <Link href="">
                      <h5 className="max-w-72 group-hover:text-secondary">
                        {data.title}
                      </h5>
                    </Link>
                    <div className="flex items-center gap-3">
                      <Image
                        src={PlayLightIcon}
                        alt="play-light-icon"
                        width={20}
                        height={20}
                        className="dark:hidden w-5 h-5"
                      />
                      <Image
                        src={PlayDarkIcon}
                        alt="play-dark-icon"
                        width={20}
                        height={20}
                        className="hidden dark:block w-5 h-5"
                      />
                      <p className="text-primary/70 dark:text-creamwhite/70">
                        <span> {data.duration}</span>
                        <span>hours</span>
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 flex items-center gap-3 ">
                    <Link
                      href=""
                      className="h-10 w-10 block rounded-full overflow-hidden"
                    >
                      <Image
                        src={data.instructor.avatar}
                        width={40}
                        height={40}
                        alt="course-owner"
                        className="w-10 h-10"
                      />
                    </Link>
                    <div className="flex flex-col justify-center">
                      <Link href="">
                        <h6> {data.instructor.name}</h6>
                      </Link>
                      <p className="text-primary/70 dark:text-creamwhite/70">
                        {data.instructor.title}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
