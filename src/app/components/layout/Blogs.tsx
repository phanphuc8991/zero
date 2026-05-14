import { SectionHeader } from "@/app/components/ui/SectionHeader";
import blog_4 from "@/assets/images/blogs/blog-4.jpeg";
import blog_6 from "@/assets/images/blogs/blog-6.jpeg";
import { CardBlog } from "@/app/components/ui/CardBlog";
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
          <CardBlog data={data} key={index} />
        ))}
      </div>
    </div>
  );
}
