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

export function Benefits() {
  return (
    <div className="container">
      <div className="py-11 md:py-20 flex flex-col gap-10 md:gap-12">
        <SectionHeader
          label="Benefits"
          heading="Success Stories That Inspire"
        />
        <div className="flex flex-col gap-12">
          <div>
            <Image
              alt="image"
              src={BannerImg}
              width={1140}
              height={660}
              className="rounded-2xl w-[1140px] h-[660px]"
              unoptimized
            />
          </div>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-5 sm:gap-6">
            <div className="flex items-start gap-6">
              <Image
                alt="image"
                src={Icon1}
                width={40}
                height={40}
                className="w-[40px] h-[40px]"
              />
              <div className="flex flex-col sm:gap-2">
                <h5>Team Coaching</h5>
                <h6 className="text-primary/70 dark:text-creamwhite/70">
                  Learn from industry leaders with courses designed to provide
                  practical, real-world knowledge and skills.
                </h6>
              </div>
            </div>
            <div className="flex items-start gap-6">
              <Image
                alt="image"
                src={Icon2}
                width={40}
                height={40}
                className="w-[40px] h-[40px]"
              />
              <div className="flex flex-col sm:gap-2">
                <h5>Lifetime Access</h5>
                <h6 className="text-primary/70 dark:text-creamwhite/70">
                  Enjoy unlimited access to your courses with a one-time payment
                  — learn at your own pace, anytime.
                </h6>
              </div>
            </div>
            <div className="flex items-start gap-6">
              <Image
                alt="image"
                src={Icon3}
                width={40}
                height={40}
                className="w-[40px] h-[40px]"
              />
              <div className="flex flex-col sm:gap-2">
                <h5>Completion Certificate</h5>
                <h6 className="text-primary/70 dark:text-creamwhite/70">
                  Showcase your achievement with a recognized certificate,
                  adding value to your resume and career growth.
                </h6>
              </div>
            </div>
            <div className="flex items-start gap-6">
              <Image
                alt="image"
                src={Icon4}
                width={40}
                height={40}
                className="w-[40px] h-[40px]"
              />
              <div className="flex flex-col sm:gap-2">
                <h5>Community Connection</h5>
                <h6 className="text-primary/70 dark:text-creamwhite/70">
                  Join a vibrant community of learners and professionals,
                  exchange ideas, and grow your network.
                </h6>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-5 md:gap-8">
          <h5>Brands in Collaboration</h5>
          <div className="w-full h-auto overflow-hidden">
            <div className="flex w-[2500px] animation-slider-brand">
              <div className="w-[200px]">
                <Image
                  alt="image"
                  src={BrandLightIcon1}
                  width={155}
                  height={40}
                  className="dark:hidden w-[155px] h-[40px]"
                />
                <Image
                  alt="image"
                  src={BrandDarkIcon1}
                  width={155}
                  height={40}
                  className="hidden dark:block w-[155px] h-[40px]"
                />
              </div>
              <div className="w-[200px]">
                <Image
                  alt="image"
                  src={BrandLightIcon2}
                  width={155}
                  height={40}
                  className="dark:hidden w-[155px] h-[40px]"
                />
                <Image
                  alt="image"
                  src={BrandDarkIcon2}
                  width={155}
                  height={40}
                  className="hidden dark:block w-[155px] h-[40px]"
                />
              </div>
              <div className="w-[200px]">
                <Image
                  alt="image"
                  src={BrandLightIcon3}
                  width={155}
                  height={40}
                  className="dark:hidden w-[155px] h-[40px]"
                />
                <Image
                  alt="image"
                  src={BrandDarkIcon3}
                  width={155}
                  height={40}
                  className="hidden dark:block w-[155px] h-[40px]"
                />
              </div>
              <div className="w-[200px]">
                <Image
                  alt="image"
                  src={BrandLightIcon4}
                  width={155}
                  height={40}
                  className="dark:hidden w-[155px] h-[40px]"
                />
                <Image
                  alt="image"
                  src={BrandDarkIcon4}
                  width={155}
                  height={40}
                  className="hidden dark:block w-[155px] h-[40px]"
                />
              </div>
              <div className="w-[200px]">
                <Image
                  alt="image"
                  src={BrandLightIcon5}
                  width={155}
                  height={40}
                  className="dark:hidden w-[155px] h-[40px]"
                />
                <Image
                  alt="image"
                  src={BrandDarkIcon5}
                  width={155}
                  height={40}
                  className="hidden dark:block w-[155px] h-[40px]"
                />
              </div>

              <div className="w-[200px]">
                <Image
                  alt="image"
                  src={BrandLightIcon1}
                  width={155}
                  height={40}
                  className="dark:hidden w-[155px] h-[40px]"
                />
                <Image
                  alt="image"
                  src={BrandDarkIcon1}
                  width={155}
                  height={40}
                  className="hidden dark:block w-[155px] h-[40px]"
                />
              </div>
              <div className="w-[200px]">
                <Image
                  alt="image"
                  src={BrandLightIcon2}
                  width={155}
                  height={40}
                  className="dark:hidden w-[155px] h-[40px]"
                />
                <Image
                  alt="image"
                  src={BrandDarkIcon2}
                  width={155}
                  height={40}
                  className="hidden dark:block w-[155px] h-[40px]"
                />
              </div>
              <div className="w-[200px]">
                <Image
                  alt="image"
                  src={BrandLightIcon3}
                  width={155}
                  height={40}
                  className="dark:hidden w-[155px] h-[40px]"
                />
                <Image
                  alt="image"
                  src={BrandDarkIcon3}
                  width={155}
                  height={40}
                  className="hidden dark:block w-[155px] h-[40px]"
                />
              </div>
              <div className="w-[200px]">
                <Image
                  alt="image"
                  src={BrandLightIcon4}
                  width={155}
                  height={40}
                  className="dark:hidden w-[155px] h-[40px]"
                />
                <Image
                  alt="image"
                  src={BrandDarkIcon4}
                  width={155}
                  height={40}
                  className="hidden dark:block w-[155px] h-[40px]"
                />
              </div>
              <div className="w-[200px]">
                <Image
                  alt="image"
                  src={BrandLightIcon5}
                  width={155}
                  height={40}
                  className="dark:hidden w-[155px] h-[40px]"
                />
                <Image
                  alt="image"
                  src={BrandDarkIcon5}
                  width={155}
                  height={40}
                  className="hidden dark:block w-[155px] h-[40px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
