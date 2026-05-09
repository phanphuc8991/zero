import { CardMarquee } from "@/app/components/layout/CardMarquee";
import { HeadLine } from "@/app/components/layout/HeadLine";
import { Statistic } from "@/app/components/ui/Statistic";
import { SectionHeader } from "@/app/components/ui/SectionHeader";
import { PillButton } from "./components/ui/PillButton";
import ArrowUpRight from "@/assets/images/icon/arrow-up-right.svg";
import CourseItemImage1 from "@/assets/images/courses/courses_img-2.jpeg";
import image_4 from "@/assets/images/home/profile-img-4.png";
import { CardCourse } from "@/app/components/ui/CardCourse";

const list = [
  {
    count: "150",
    label: "Courses availabel",
  },
  {
    count: "75",
    label: "Industry experts",
  },
  {
    count: "10",
    label: "Years in industry",
  },
  {
    count: "1,000",
    label: "Certificates to earn",
  },
];

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

export default function HomePage() {
  return (
    <>
      <section>
        <HeadLine />
        <CardMarquee />
      </section>
      <section>
        <div className="container">
          <div className="py-11 md:py-20 flex flex-col gap-10 md:gap-12">
            <SectionHeader
              label="About us"
              heading="Empowering learners with expert-led courses, fostering growth, building confidence, and unlocking career opportunities."
            />
            <div className="grid md:grid-cols-4 xsm:grid-cols-2 grid-cols-1 md:pt-6 gap-5 lg:gap-6 text-center md:text-left">
              {list.map((item, index) => (
                <Statistic data={item} key={index} />
              ))}
            </div>
          </div>
        </div>
      </section>
      <section id="courses">
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
      </section>
    </>
  );
}
