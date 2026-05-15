"use client";
import Image from "next/image";
import PlayDarkIcon from "@/assets/images/icon/play-dark-icon.svg";
import PlayLightIcon from "@/assets/images/icon/play-light-icon.svg";
import Link from "next/link";
import image_1 from "@/assets/images/home/profile-img-1.png";
import CourseItemImage2 from "@/assets/images/courses/courses_img-2.jpeg";
import * as Accordion from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import { PillButton } from "@/app/components/ui/PillButton";
import ListSecondaryIcon from "@/assets/images/icon/list-secondary-icon.svg";
import VideoLightIcon from "@/assets/images/icon/video-light-icon.svg";
import VideoDarkIcon from "@/assets/images/icon/video-dark-icon.svg";
import DarkCloseIcon from "@/assets/images/icon/close-dark-icon.svg";
import LightCloseIcon from "@/assets/images/icon/close-light-icon.svg";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import LightArrowUpIcon from "@/assets/images/icon/light-arrow-up-icon.svg";
import DarkArrowUpIcon from "@/assets/images/icon/dark-arrow-up-icon.svg";
import DarkLogo from "@/assets/images/logo/dark-logo.svg";
import LightLogo from "@/assets/images/logo/light-logo.svg";
import { Pricing } from "@/app/components/layout/Pricing";
import { FrequentlyAskedQuestions } from "@/app/components/layout/FrequentlyAskedQuestions";
import { Blogs } from "@/app/components/layout/Blogs";
import { LearnGrowSuccess } from "@/app/components/layout/LearnGrowSuccess";

const listSkills = [
  "AI Marketing Basics",
  "Customer Data Insights ",
  "Predictive Analytics",
  "Automated Campaigns",
  "Content Generation Tools",
  "Audience Segmentation",
  "Chatbot Integration",
  "Real-Time Optimization",
];

const listYouWilLearn = [
  {
    text1: "MODULE 1",
    text2: "Foundations of AI in Marketing",
    text3:
      "Collecting the right data is the foundation of successful AI marketing. In this module, you’ll explore how to gather, clean, and structure customer data from multiple touchpoints—websites, social media, CRMs, and more. Learn how to build rich customer profiles and uncover patterns that drive behavior. You’ll also dive into segmentation techniques, behavioral analytics, and customer journey mapping to create hyper-personalized",
  },

  {
    text1: "MODULE 2",
    text2: "Data & Customer Intelligence",
    text3:
      "Collecting the right data is the foundation of successful AI marketing. In this module, you’ll explore how to gather, clean, and structure customer data from multiple touchpoints—websites, social media, CRMs, and more. Learn how to build rich customer profiles and uncover patterns that drive behavior. You’ll also dive into segmentation techniques, behavioral analytics, and customer journey mapping to create hyper-personalized",
  },
  {
    text1: "MODULE 3",
    text2: "Predictive Analytics & Automation",
    text3:
      "Collecting the right data is the foundation of successful AI marketing. In this module, you’ll explore how to gather, clean, and structure customer data from multiple touchpoints—websites, social media, CRMs, and more. Learn how to build rich customer profiles and uncover patterns that drive behavior. You’ll also dive into segmentation techniques, behavioral analytics, and customer journey mapping to create hyper-personalized",
  },
];

const listCourseContent = [
  {
    title:
      "Week 1 - Introduction to AI Automation: Tools, Trends & Opportunities",
    duration: "03:15",
    link: "/",
  },
  {
    title:
      "Week 2 - Automating Repetitive Tasks with Zapier, Make.com & AI APIs",
    duration: "03:15",
    link: "/",
  },
  {
    title:
      "Week 3 - Building Smart Workflows with ChatGPT, Webhooks & Integrations",
    duration: "03:15",
    link: "/",
  },
  {
    title:
      "Week 4 - Intelligent Document Processing: PDFs, Emails & Forms with AI",
    duration: "03:15",
    link: "/",
  },
  {
    title: "Week 5 - Real-Time Notifications & Auto-Response Systems",
    duration: "03:15",
    link: "/",
  },
  {
    title:
      "Week 6 - Advanced Automations: Cron Jobs, Scheduling, and Data Syncing",
    duration: "03:15",
    link: "/",
  },
  {
    title: "- Case Studies: End-to-End AI Automation in Different Industries",
    duration: "03:15",
    link: "/",
  },
  {
    title: "Bonus - Build Your Own AI Virtual Assistant to Manage Job Flows",
    duration: "03:15",
    link: "/",
  },
];

const listBenefit = [
  "Digital Marketing Managers",
  "Performance Marketers & Analysts",
  "Content Creators & Copywriters",
  "Startup Founders & Entrepreneurs",
  "Professionals shifting into AI roles",
];

export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [open, setOpen] = useState(false);
  // const {slug} = await params;
  // const course = getCourse(slug)
  return (
    <section>
      <div className="container">
        <div className="pb-16 md:pb-20 pt-32 md:pt-40">
          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-4">
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
                  <span>{12}</span>
                  <span>hours</span>
                </p>
              </div>
              <h3>Automate Job Flow With AI</h3>
              <div className="flex items-center gap-4">
                <Link
                  href=""
                  className="h-10 w-10 block rounded-full overflow-hidden"
                >
                  <Image
                    src={image_1}
                    width={40}
                    height={40}
                    alt="course-owner"
                    className="w-10 h-10"
                  />
                </Link>
                <div className="flex flex-col justify-center">
                  <Link href="">
                    <h6>Olivia Hayes</h6>
                  </Link>
                  <p className="text-primary/70 dark:text-creamwhite/70">
                    Automation Expert
                  </p>
                </div>
              </div>
            </div>
            <div className="relative h-100 md:h-175 w-full">
              <Image
                src={CourseItemImage2}
                alt="image"
                fill
                priority
                className="object-center object-cover rounded-2xl"
              />
            </div>
            <div className="flex gap-6">
              <div className="flex flex-col gap-10 md:gap-16 flex-1">
                <div className="flex flex-col gap-4">
                  <h5>About The Course</h5>
                  <p className="text-lg text-primary dark:text-creamwhite">
                    The AI-Powered Marketing Mastery Course is a comprehensive
                    program crafted to revolutionize your approach to digital
                    marketing using the latest advancements in artificial
                    intelligence. This course blends theory with real-world
                    application through expert-led sessions and practical
                    assignments. ver several weeks, participants will dive deep
                    into how AI is transforming the marketing landscape from
                    automating repetitive tasks to generating hyper-personalized
                    customer journeys at scale.
                  </p>
                  <ul className="list-disc pl-5 mt-2.5">
                    <li className="text-lg mb-2 text-primary dark:creamwhite">
                      Understand the fundamentals of AI in marketing
                    </li>
                    <li className="text-lg mb-2 text-primary dark:creamwhite">
                      Harness machine learning to personalize customer
                      experiences
                    </li>{" "}
                    <li className="text-lg mb-2 text-primary dark:creamwhite">
                      Utilize predictive analytics to forecast trends and
                      behaviors
                    </li>{" "}
                    <li className="text-lg mb-2 text-primary dark:creamwhite">
                      Build and automate high-converting marketing campaigns
                    </li>{" "}
                    <li className="text-lg mb-2 text-primary dark:creamwhite">
                      Optimize ad spend with data-driven decision-making
                    </li>
                    <li className="text-lg mb-2 text-primary dark:creamwhite">
                      Integrate AI tools into existing marketing workflows
                    </li>
                    <li className="text-lg mb-2 text-primary dark:creamwhite">
                      Analyze campaign performance using advanced metrics
                    </li>
                    <li className="text-lg mb-2 text-primary dark:creamwhite">
                      Stay ahead with the latest AI trends and ethical practices
                    </li>
                  </ul>
                </div>
                <div className="flex flex-col gap-4">
                  <h5>Skills You'll Gain</h5>
                  <div className="flex flex-wrap gap-1.5 sm:gap-3">
                    {listSkills.map((text, index) => (
                      <div
                        key={index}
                        className="py-2 md:py-3 px-3.5 md:px-5 rounded-2xl border broder-primary/20 dark:border-creamwhite/20"
                      >
                        {" "}
                        <p className="text-sm sm:text-base">{text}</p>{" "}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <h5>What will you learn?</h5>
                  <Accordion.Root
                    type="single"
                    className="flex flex-col gap-4"
                    collapsible
                  >
                    {listYouWilLearn.map((data, index) => (
                      <Accordion.Item
                        key={index}
                        value={`${index}`}
                        className="py-4 lg:py-7 px-3 lg:px-6 border border-primary/20 dark:border-creamwhite/20 rounded-2xl "
                      >
                        <Accordion.Header className="flex">
                          <Accordion.Trigger className="text-left flex cursor-pointer text-sm font-medium justify-between items-center flex-1 [&[data-state=open]>#plusicon]:rotate-45">
                            <div className="flex flex-col gap-1">
                              <p className="text-primary/70 dark:text-creamwhite/70">
                                {data.text1}
                              </p>
                              <h6 className="font-medium">{data.text2}</h6>
                            </div>

                            <div
                              id="plusicon"
                              className="border border-black dark:border-creamwhite p-1 lg:p-3 rounded-full transition-transform duration-300 ease-in-out"
                            >
                              <Plus size={24} />
                            </div>
                          </Accordion.Trigger>
                        </Accordion.Header>
                        <Accordion.Content className="overflow-hidden text-sm data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp">
                          <p className="text-primary/70 dark:text-creamwhite/70 pt-4">
                            {data.text3}
                          </p>
                        </Accordion.Content>
                      </Accordion.Item>
                    ))}
                  </Accordion.Root>
                </div>
                <div className="flex flex-col gap-4">
                  <h5>Course content</h5>
                  <div className="flex flex-col gap-2">
                    {listCourseContent.map((data, index) => (
                      <div
                        key={index}
                        className="group border border-primary/20 dark:border-creamwhite/20 rounded-2xl py-2.5 sm:py-4 px-3.5 sm:px-6 cursor-pointer"
                        onClick={() => {
                          setOpen(true);
                        }}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex gap-3.5 items-center">
                            <Image
                              src={VideoLightIcon}
                              alt="video-icon"
                              width={20}
                              height={20}
                              className="w-5 h-5 dark:hidden"
                            />
                            <Image
                              src={VideoDarkIcon}
                              alt="video-icon"
                              width={20}
                              height={20}
                              className="w-5 h-5 hidden dark:block"
                            />
                            <p className="font-medium group-hover:text-secondary">
                              {data.title}
                            </p>
                          </div>
                          <p>{data.duration}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Dialog.Root open={open} onOpenChange={setOpen}>
                    <Dialog.Portal>
                      <Dialog.Overlay className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" />
                      <Dialog.Content
                        onPointerDownOutside={(e) => {
                          e.preventDefault();
                        }}
                        className="fixed left-1/2 top-1/2 bg-warm-ivory dark:bg-primary p-6 rounded-2xl max-w-lg w-full -translate-x-1/2 -translate-y-1/2 focus:outline-none z-60"
                      >
                        <Dialog.Title className="text-primary/70 dark:text-creamwhite/70 text-base mb-2">
                          Course Preview
                        </Dialog.Title>
                        <Dialog.Description className="font-medium mb-6">
                          {" "}
                          Week 1 - Introduction to AI Automation: Tools, Trends
                          & Opportunities
                        </Dialog.Description>
                        <div className="h-80">
                          <iframe
                            src="https://www.youtube.com/embed/8WoZlrkAcww?si=cicDIp9vpmSxshzh"
                            className="w-full h-full rounded-2xl "
                          ></iframe>
                        </div>
                        <Dialog.Close asChild className="cursor-pointer">
                          <div className="absolute right-2.5 top-2.5">
                            <Image
                              src={LightCloseIcon}
                              alt="icon"
                              width={22}
                              height={22}
                              className="w-5.5 h-5.5 dark:hidden"
                            />
                            <Image
                              src={DarkCloseIcon}
                              alt="icon"
                              width={22}
                              height={22}
                              className="w-5.5 h-5.5 hidden dark:block"
                            />
                          </div>
                        </Dialog.Close>
                      </Dialog.Content>
                    </Dialog.Portal>
                  </Dialog.Root>
                </div>
                <div className="flex flex-col gap-4">
                  <h5>Who Will Benefit From This Course?</h5>
                  <div className="grid grid-cols-1 xl:grid-cols-2 rounded-2xl bg-warm-ivory dark:bg-middlegreen p-4 md:p-6 gap-4">
                    {listBenefit.map((text, index) => (
                      <div key={index} className="flex gap-3 items-center ">
                        <Image
                          alt="icon"
                          src={ListSecondaryIcon}
                          width={24}
                          height={24}
                          className="w-6 h-6"
                        />
                        <p className="text-lg">{text}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <h5>Professional Certificate</h5>
                  <div className="relative p-7 md:p-12 border border-primary/20 rounded-2xl shadow-boxshadow overflow-hidden z-10">
                    <div className="flex flex-col gap-24">
                      <div className="flex flex-col gap-16">
                        <div className="grid grid-cols-2">
                          <div className="flex flex-col gap-6">
                            <div className="flex items-center">
                              <Link href="/">
                                <Image
                                  alt="logo"
                                  src={LightLogo}
                                  width={190}
                                  height={34}
                                  className="dark:hidden h-auto w-auto"
                                  loading="eager"
                                />
                                <Image
                                  alt="logo"
                                  src={DarkLogo}
                                  width={190}
                                  height={34}
                                  className="hidden dark:block h-auto w-auto"
                                  loading="eager"
                                />
                              </Link>
                            </div>
                            <p className="text-primary/60 dark:creamwhite/60">
                              Certificate of completion
                            </p>
                          </div>
                          <div className="flex justify-end">
                            <p className="text-primary/60 dark:creamwhite/60">
                              25.01.2025
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <h4 className="text-secondary">
                            AI-Driven Marketing Mastery
                          </h4>
                          <h4>Your name</h4>
                        </div>
                      </div>
                      <div>
                        <p className="text-primary/60 dark:creamwhite/60">
                          Successfully completed all
                        </p>
                        <p className="text-primary/60 dark:creamwhite/60">
                          masterclass with material
                        </p>
                      </div>
                    </div>
                    <div className="absolute w-79 h-80.75 bottom-0 right-0">
                      <Image
                        alt="arrow-image"
                        src={LightArrowUpIcon}
                        width={316}
                        height={323}
                        className="w-full h-auto dark:hidden"
                      />
                      <Image
                        alt="arrow-image"
                        src={DarkArrowUpIcon}
                        width={316}
                        height={323}
                        className="w-full h-auto hidden dark:block"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="max-w-sm w-full hidden lg:block">
                <div className="bg-warm-ivory dark:bg-middlegreen p-6 w-full rounded-2xl flex flex-col gap-6 h-fit sticky top-28">
                  <h4>
                    <span>$</span>
                    <span>50.00</span>
                  </h4>
                  <div className="flex flex-col gap-5">
                    <div className="flex gap-3 items-center">
                      <Image
                        alt="icon"
                        src={ListSecondaryIcon}
                        width={24}
                        height={24}
                        className="w-6 h-6"
                      />
                      <h6 className="text-primary dark:text-creamwhite">
                        Professional certificate
                      </h6>
                    </div>
                    <div className="flex gap-3 items-center">
                      <Image
                        alt="icon"
                        src={ListSecondaryIcon}
                        width={24}
                        height={24}
                        className="w-6 h-6"
                      />
                      <h6 className="text-primary dark:text-creamwhite">
                        Flexible learning path
                      </h6>
                    </div>
                    <div className="flex gap-3 items-center">
                      <Image
                        alt="icon"
                        src={ListSecondaryIcon}
                        width={24}
                        height={24}
                        className="w-6 h-6"
                      />
                      <h6 className="text-primary dark:text-creamwhite">
                        24/7 support
                      </h6>
                    </div>{" "}
                    <div className="flex gap-3 items-center">
                      <Image
                        alt="icon"
                        src={ListSecondaryIcon}
                        width={24}
                        height={24}
                        className="w-6 h-6"
                      />
                      <h6 className="text-primary dark:text-creamwhite">
                        Downloadable materials
                      </h6>
                    </div>
                  </div>
                  <PillButton label="Buy now" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <section>
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
      </div>
    </section>
  );
}
