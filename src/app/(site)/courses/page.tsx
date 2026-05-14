import { SectionHeader } from "@/app/components/ui/SectionHeader";
import Image from "next/image";
import CourseIcon from "@/assets/images/icon/course-icon.svg";
import { CardCourse } from "@/app/components/ui/CardCourse";
import CourseItemImage1 from "@/assets/images/courses/courses_img-1.png";
import CourseItemImage2 from "@/assets/images/courses/courses_img-2.jpeg";
import CourseItemImage3 from "@/assets/images/courses/courses_img-3.jpeg";
import CourseItemImage4 from "@/assets/images/courses/courses_img-4.jpeg";
import CourseItemImage5 from "@/assets/images/courses/courses_img-5.jpeg";
import CourseItemImage6 from "@/assets/images/courses/courses_img-6.jpeg";
import image_1 from "@/assets/images/home/profile-img-1.png";
import image_2 from "@/assets/images/home/profile-img-2.png";
import image_3 from "@/assets/images/home/profile-img-3.png";
import image_4 from "@/assets/images/home/profile-img-4.png";
import image_5 from "@/assets/images/home/profile-img-5.png";

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
  {
    coverImage: CourseItemImage5,
    title: "Ultimate Content Creation Mastery",
    duration: "12",
    instructor: {
      name: "Ethan Walker",
      title: "AI Content Strategist",
      avatar: image_5,
    },
  },
  {
    coverImage: CourseItemImage6,
    title: "Ultimate Content Creation Mastery",
    duration: "12",
    instructor: {
      name: "Ethan Walker",
      title: "AI Content Strategist",
      avatar: image_1,
    },
  },
];
export default function Courses() {
  return (
    <section>
      <div className="container">
        <div className="flex flex-col gap-8 md:gap-14 md:pt-40 pt-32 md:pb-20 pb-16">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <Image
                width={20}
                height={20}
                className="w-5 h-5"
                src={CourseIcon}
                alt="icon"
              />
              <p className="text-secondary">Courses</p>
            </div>
            <h3>Courses That Shape the Future</h3>
            <h6 className="text-primary/70 dark:text-creamwhite/70">
              Discover cutting-edge courses designed to spark creativity, drive
              transformation, and equip you with the tools to lead in a
              fast-changing world.
            </h6>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {[...listCourse, ...listCourse].map((data, index) => (
              <CardCourse data={data} key={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
