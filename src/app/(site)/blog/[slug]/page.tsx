import User1 from "@/assets/images/home/user-1.jpg";
import Image from "next/image";
import LightClockIcon from "@/assets/images/icon/light-clock-icon.svg";
import DarkClockIcon from "@/assets/images/icon/light-clock-icon.svg";
import CourseItemImage3 from "@/assets/images/courses/courses_img-3.jpeg";
export default function Page() {
  return (
    <section>
      <div className="container">
        <div className="pb-16 md:pb-20 pt-32 md:pt-40 flex flex-col gap-8 md:gap-12">
          <div className="flex flex-col gap-4">
            <h3>
              7 Small Details That Make a Big Difference in Online Courses
            </h3>
            <h6 className="text-primary/70 dark:text-creamwhite/70">
              The success of a course often comes down to small, thoughtful
              touches. While curriculum and instructors matter, learners also
              notice the experience around them — how easy it is to navigate,
              how supported they feel, how engaging the layout is.
            </h6>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Image
                alt="author-image"
                src={User1}
                width={48}
                height={48}
                className="w-12 h-12 rounded-full"
              />
              <p className="text-primary/70 dark:text-creamwhite/70">
                Roddy Nicolas
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Image
                alt="author-image"
                src={LightClockIcon}
                width={24}
                height={24}
                className="w-6 h-6 rounded-full dark:hidden"
              />
              <Image
                alt="author-image"
                src={DarkClockIcon}
                width={24}
                height={24}
                className="w-6 h-6 rounded-full hidden dark:block"
              />
              <p className="text-primary/70 dark:text-creamwhite/70">
                23 Dec 2025
              </p>
            </div>
          </div>
          <div className="relative w-full h-125 lg:h-175 rounded-2xl overflow-hidden">
            <Image
              alt="image"
              src={CourseItemImage3}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="flex justify-end">
            <div className="blog-content">
              <h5>
                Here are 7 small but powerful details that elevate any learning
                portal:
              </h5>
              <h6>1. Progress bars that show how far students have come.</h6>
              <h6>
                2. Bookmarking features so they can pick up where they left off.
              </h6>
              <h6>3. Audio versions of lessons for learners on the go.</h6>
              <h6>
                4. Night mode to reduce eye strain during late-night study
                sessions.
              </h6>
              <h6>5. Quick quizzes to reinforce concepts.</h6>
              <h6>6. Peer discussion areas for connecting and sharing.</h6>
              <h6>7. Friendly reminders to keep learners on track.</h6>
              <h6>
                8. These features don’t cost a fortune to implement, but they
                dramatically improve how students feel while learning.
              </h6>
              <p>
                Craft Personalized Outreach Messages: Develop tailored emails
                that acknowledge the blogger's work and propose a mutually
                beneficial collaboration. Avoid generic templates to increase
                response rates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
