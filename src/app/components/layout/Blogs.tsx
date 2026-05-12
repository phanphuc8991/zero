import { SectionHeader } from "@/app/components/ui/SectionHeader";
import Image from "next/image";
import blog_4 from "@/assets/images/blogs/blog-4.jpeg";
import blog_6 from "@/assets/images/blogs/blog-6.jpeg";
import Link from "next/link";
const blogPosts = [
  {
    title: "7 Small Details That Make a Big Difference in Online Courses",
    date: "23 Dec 2025",
    image: blog_4,
  },
  {
    title: "Learning at Your Own Pace - Why Flexibility Matters More Than Ever",
    date: "24 Dec 2025",
    image: blog_6,
  },
];
export function Blogs() {
  return (
    <div className="container">
      <div className="py-11 md:py-20 flex flex-col gap-10 md:gap-12">
        <SectionHeader label="Blog" heading="Recent Insights & Blogs" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blogPosts.map((data, index) => (
          <div className="group flex flex-col gap-2.5 md:gap-5" key={index}>
            <Link
              href=""
              className=" overflow-hidden block rounded-2xl h-96 w-full relative"
            >
              <Image
                alt="image"
                src={data.image}
                fill
                className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                unoptimized
              />
            </Link>

            <div className="flex flex-col md:gap-2">
              <p className="text-primary/70 dark:text-creamwhite/70">
                {data.date}
              </p>
              <Link href="">
                <h5 className="group-hover:text-secondary">{data.title}</h5>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
