import { CardMarquee } from "@/app/components/layout/CardMarquee";
import { HeadLine } from "@/app/components/layout/HeadLine";
import { AboutUs } from "@/app/components/layout/AboutUs";
import { Courses } from "./components/layout/Courses";
import { Testimonials } from "./components/layout/Testimonials";
import { Benefits } from "@/app/components/layout/Benefits";
import { Pricing } from "@/app/components/layout/Pricing";
import { FrequentlyAskedQuestions } from "@/app/components/layout/FrequentlyAskedQuestions";
import { Blogs } from "@/app/components/layout/Blogs";
import { LearnGrowSuccess } from "@/app/components/layout/LearnGrowSuccess";

export default function HomePage() {
  return (
    <>
      <section>
        <HeadLine />
        <CardMarquee />
      </section>
      <section id="about-us">
        <AboutUs />
      </section>
      <section id="courses">
        <Courses />
      </section>
      <section id="testimonials">
        <Testimonials />
      </section>
      <section id="benefits">
        <Benefits />
      </section>
      <section id="pricing">
        <Pricing />
      </section>
      <section>
        <FrequentlyAskedQuestions />
      </section>
      <section>
        <Blogs />
      </section>
      <section>
        <LearnGrowSuccess />
      </section>
    </>
  );
}
