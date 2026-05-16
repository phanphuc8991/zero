import { SectionHeader } from "@/app/components/ui/SectionHeader";
import Image from "next/image";
import BasicLightIcon1 from "@/assets/images/icon/basic-light-icon-1.svg";
import BasicDarkIcon1 from "@/assets/images/icon/basic-dark-icon-1.svg";

import BasicLightIcon2 from "@/assets/images/icon/basic-light-icon-2.svg";
import BasicDarkIcon2 from "@/assets/images/icon/basic-dark-icon-2.svg";

import BasicLightIcon3 from "@/assets/images/icon/basic-light-icon-3.svg";
import BasicDarkIcon3 from "@/assets/images/icon/basic-dark-icon-3.svg";

import ListLightIcon from "@/assets/images/icon/list-light-icon.svg";
import ListDarkIcon from "@/assets/images/icon/list-dark-icon.svg";

import { PillButton } from "@/app/components/ui/PillButton";
const pricingPlans = [
  {
    id: 1,
    title: "Basic",
    price: 0,
    unit: "per month",
    description: "Start free, explore interests, learn essential skills.",
    iconLight: BasicLightIcon1,
    iconDark: BasicDarkIcon1,
    features: [
      {
        text: "Access to 3 Beginner Courses",
        iconLight: ListLightIcon,
        iconDark: ListDarkIcon,
      },
      {
        text: "Community Support",
        iconLight: ListLightIcon,
        iconDark: ListDarkIcon,
      },
      {
        text: "No Credit Card Required",
        iconLight: ListLightIcon,
        iconDark: ListDarkIcon,
      },
    ],
    buttonText: "Get Started",
  },
  {
    id: 2,
    title: "Growth",
    price: 19,
    unit: "per month",
    description: "Build foundational skills with 10 essential courses.",
    iconLight: BasicLightIcon2,
    iconDark: BasicDarkIcon2,
    features: [
      {
        text: "Expert-Led Video Lessons",
        iconLight: ListLightIcon,
        iconDark: ListDarkIcon,
      },
      {
        text: "Downloadable Resources",
        iconLight: ListLightIcon,
        iconDark: ListDarkIcon,
      },
      {
        text: "Community Support",
        iconLight: ListLightIcon,
        iconDark: ListDarkIcon,
      },
      {
        text: "Completion Certificate",
        iconLight: ListLightIcon,
        iconDark: ListDarkIcon,
      },
    ],
    buttonText: "Get Started",
  },
  {
    id: 3,
    title: "Scale",
    price: 49,
    unit: "per month",
    description: "Advance career growth with all-access learning content.",
    iconLight: BasicLightIcon3,
    iconDark: BasicDarkIcon3,
    features: [
      {
        text: "Personalized Learning Paths",
        iconLight: ListLightIcon,
        iconDark: ListDarkIcon,
      },
      {
        text: "Live Q&A Sessions",
        iconLight: ListLightIcon,
        iconDark: ListDarkIcon,
      },
      {
        text: "Premium Community Access",
        iconLight: ListLightIcon,
        iconDark: ListDarkIcon,
      },
      {
        text: "Industry-Recognized Certificates",
        iconLight: ListLightIcon,
        iconDark: ListDarkIcon,
      },
    ],
    buttonText: "Get Started",
  },
];

const CardPricing = (props: any) => {
  const { data } = props;
  return (
    <div className="md:p-6 p-4 border border-primary/20 dark:border-creamwhite/20 flex flex-col md:gap-6 gap-4 rounded-2xl">
      <div>
        <Image
          alt="icon"
          src={data.iconLight}
          width={40}
          height={40}
          className="dark:hidden w-6 h-6"
        />
        <Image
          alt="icon"
          src={data.iconDark}
          width={40}
          height={40}
          className="hidden dark:block w-6 h-6"
        />
      </div>
      <div className="flex flex-col gap-2">
        <h5>{data.title}</h5>
        <h6 className="text-primary/70 dark:text-creamwhite/70">
          {data.description}
        </h6>
      </div>
      <div className="flex gap-2 items-center">
        <h4>{data.price}</h4>
        <p className="text-primary/70 dark:text-creamwhite/70">{data.unit}</p>
      </div>
      <div className="border-t border-primary/20 dark:border-creamwhite/20"></div>
      <ul className="flex flex-col md:gap-4 gap-2.5">
        {data.features.map((data: any, index: any) => (
          <li key={index} className="flex gap-3 items-start">
            <Image
              alt="icon"
              src={data.iconLight}
              width={40}
              height={40}
              className="dark:hidden w-6 h-6"
            />
            <Image
              alt="icon"
              src={data.iconDark}
              width={24}
              height={24}
              className="hidden dark:block w-6 h-6"
            />
            <span className="text-lg">{data.text}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto">
        <PillButton label="Get Started" href="/" />
      </div>
    </div>
  );
};
export function Pricing() {
  return (
    <div className="container">
      <div className="py-11 md:py-20 flex flex-col gap-10 md:gap-12">
        <SectionHeader label="Pricing" heading="Invest in Your Growth" />
        <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
          {pricingPlans.map((data, index) => (
            <CardPricing key={index} data={data} />
          ))}
        </div>
      </div>
    </div>
  );
}
