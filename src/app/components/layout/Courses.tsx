import { SectionHeader } from "@/app/components/ui/SectionHeader";
import { PillButton } from "@/app/components/ui/PillButton";
import CourseItemImage1 from "@/assets/images/courses/courses_img-2.jpeg";
import image_4 from "@/assets/images/home/profile-img-4.png";
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
      avatar: image_4,
    },
  },
  {
    coverImage: CourseItemImage1,
    title: "Ultimate Content Creation Mastery",
    duration: "12",
    instructor: {
      name: "Ethan Walker",
      title: "AI Content Strategist",
      avatar: image_4,
    },
  },
  {
    coverImage: CourseItemImage1,
    title: "Ultimate Content Creation Mastery",
    duration: "12",
    instructor: {
      name: "Ethan Walker",
      title: "AI Content Strategist",
      avatar: image_4,
    },
  },
  {
    coverImage: CourseItemImage1,
    title: "Ultimate Content Creation Mastery",
    duration: "12",
    instructor: {
      name: "Ethan Walker",
      title: "AI Content Strategist",
      avatar: image_4,
    },
  },
  {
    coverImage: CourseItemImage1,
    title: "Ultimate Content Creation Mastery",
    duration: "12",
    instructor: {
      name: "Ethan Walker",
      title: "AI Content Strategist",
      avatar: image_4,
    },
  },
  {
    coverImage: CourseItemImage1,
    title: "Ultimate Content Creation Mastery",
    duration: "12",
    instructor: {
      name: "Ethan Walker",
      title: "AI Content Strategist",
      avatar: image_4,
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
        <div className="flex justify-center">
          <PillButton label="Explore courses" icon={ArrowUpRight} />
        </div>
      </div>
    </div>
  );
}
