import { CardBlog } from "@/app/components/ui/CardBlog";
import Image from "next/image";
import blog_4 from "@/assets/images/blogs/blog-4.jpeg";
import blog_6 from "@/assets/images/blogs/blog-6.jpeg";
import LightBlogIcon from "@/assets/images/icon/light-blog-icon.svg";
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
export default function Blgo() {
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
                src={LightBlogIcon}
                alt="icon"
              />
              <p className="text-secondary">Blog</p>
            </div>
            <h3>Level Up: Tips, Trends & Insights</h3>
            <h6 className="text-primary/70 dark:text-creamwhite/70">
              Stay inspired on your learning journey with guides, trends, and
              real-world success stories from the world of online education.
            </h6>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogPosts.map((data, index) => (
              <CardBlog data={data} key={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
