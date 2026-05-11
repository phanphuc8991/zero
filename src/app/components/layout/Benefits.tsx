import { SectionHeader } from "@/app/components/ui/SectionHeader";
import BannerImg from "@/assets/images/home/banner-img.png";
import Image from "next/image";
import Icon1 from "@/assets/images/home/benefits/icon-1.svg";
import Icon2 from "@/assets/images/home/benefits/icon-2.svg";
import Icon3 from "@/assets/images/home/benefits/icon-3.svg";
import Icon4 from "@/assets/images/home/benefits/icon-4.svg";
import BrandLightIcon1 from "@/assets/images/icon/brand-light-icon-1.svg";
import BrandDarkIcon1 from "@/assets/images/icon/brand-dark-icon-2.svg";
import BrandLightIcon2 from "@/assets/images/icon/brand-light-icon-2.svg";
import BrandDarkIcon2 from "@/assets/images/icon/brand-dark-icon-2.svg";
import BrandLightIcon3 from "@/assets/images/icon/brand-light-icon-3.svg";
import BrandDarkIcon3 from "@/assets/images/icon/brand-dark-icon-3.svg";
import BrandLightIcon4 from "@/assets/images/icon/brand-light-icon-4.svg";
import BrandDarkIcon4 from "@/assets/images/icon/brand-dark-icon-4.svg";
import BrandLightIcon5 from "@/assets/images/icon/brand-light-icon-5.svg";
import BrandDarkIcon5 from "@/assets/images/icon/brand-dark-icon-5.svg";

const list = [
  {
    src: Icon1,
    title: "Team Coaching",
    description:
      "Learn from industry leaders with courses designed to provide practical, real-world knowledge and skills.",
  },
  {
    src: Icon2,
    title: "Lifetime Access",
    description:
      "Enjoy unlimited access to your courses with a one-time payment — learn at your own pace, anytime.",
  },
  {
    src: Icon3,
    title: "Completion Certificate",
    description:
      "Showcase your achievement with a recognized certificate, adding value to your resume and career growth.",
  },
  {
    src: Icon4,
    title: "Community Connection",
    description:
      "Join a vibrant community of learners and professionals, exchange ideas, and grow your network.",
  },
];

const listBrand = [
  {
    light: BrandLightIcon1,
    dark: BrandDarkIcon1,
  },
  {
    light: BrandLightIcon2,
    dark: BrandDarkIcon2,
  },
  {
    light: BrandLightIcon3,
    dark: BrandDarkIcon3,
  },
  {
    light: BrandLightIcon4,
    dark: BrandDarkIcon4,
  },
  {
    light: BrandLightIcon5,
    dark: BrandDarkIcon5,
  },
  {
    light: BrandLightIcon1,
    dark: BrandDarkIcon1,
  },
  {
    light: BrandLightIcon2,
    dark: BrandDarkIcon2,
  },
  {
    light: BrandLightIcon3,
    dark: BrandDarkIcon3,
  },
  {
    light: BrandLightIcon4,
    dark: BrandDarkIcon4,
  },
  {
    light: BrandLightIcon5,
    dark: BrandDarkIcon5,
  },
];

const CardBrand = (props: any) => {
  const { data } = props;
  return (
    <div className="w-[200px]">
      <Image
        alt="image"
        src={data.light}
        width={155}
        height={40}
        className="dark:hidden w-[155px] h-[40px]"
      />
      <Image
        alt="image"
        src={data.dark}
        width={155}
        height={40}
        className="hidden dark:block w-[155px] h-[40px]"
      />
    </div>
  );
};
const CardBenefit = (props: any) => {
  const { data } = props;
  return (
    <div className="flex items-start gap-6">
      <Image
        alt="image"
        src={data.src}
        width={40}
        height={40}
        className="w-[40px] h-[40px]"
      />
      <div className="flex flex-col sm:gap-2">
        <h5>{data.title}</h5>
        <h6 className="text-primary/70 dark:text-creamwhite/70">
          {data.description}
        </h6>
      </div>
    </div>
  );
};

export function Benefits() {
  return (
    <div className="container">
      <div className="py-11 md:py-20 flex flex-col gap-10 md:gap-12">
        <SectionHeader
          label="Benefits"
          heading="Success Stories That Inspire"
        />
        <div className="flex flex-col gap-12">
          <div className="w-[1140px] h-[660px]">
            <Image
              alt="image"
              src={BannerImg}
              width={1140}
              height={660}
              className="rounded-2xl "
              style={{ width: "100%", height: "auto" }}
              unoptimized
            />
          </div>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-5 sm:gap-6">
            {list.map((data, index) => (
              <CardBenefit key={index} data={data} />
            ))}
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-5 md:gap-8">
          <h5>Brands in Collaboration</h5>
          <div className="w-full h-auto overflow-hidden">
            <div className="flex w-[2500px] animation-slider-brand">
              {listBrand.map((data, index) => (
                <CardBrand key={index} data={data} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
