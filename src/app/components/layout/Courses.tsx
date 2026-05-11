import { SectionHeader } from "@/app/components/ui/SectionHeader";
import { PillButton } from "@/app/components/ui/PillButton";
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

import { CardCourse } from "@/app/components/ui/CardCourse";
import ArrowUpRight from "@/assets/images/icon/arrow-up-right.svg";

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

export function Courses() {
  return (
    <div className="container">
      <div className="py-11 md:py-20 flex flex-col gap-10 md:gap-12">
        <SectionHeader
          label="Courses"
          heading="Discover Your Path Shape Your Future"
        />
        <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
          {listCourse.map((data, index) => (
            <CardCourse data={data} key={index} />
          ))}
        </div>
        <div className="self-start">
          <PillButton label="Explore courses" icon={ArrowUpRight} />
        </div>
      </div>
    </div>
  );
}
