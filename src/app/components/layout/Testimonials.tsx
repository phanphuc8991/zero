import { SectionHeader } from "@/app/components/ui/SectionHeader";
import ThumbNailImage1 from "@/assets/images/home/thumbnail-img-1.png";
import ThumbNailImage2 from "@/assets/images/home/thumbnail-img-2.png";
import YoutubeIcon from "@/assets/images/icon/youtubeicon.svg";
import Comma from "@/assets/images/icon/comma-img.svg";
import Image from "next/image";
export function Testimonials() {
  return (
    <div className="container">
      <div className="py-11 md:py-20 flex flex-col gap-10 md:gap-12">
        <SectionHeader
          label="Testimonials"
          heading="Success Stories That Inspire"
        />
        <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
          <div className="relative flex flex-col gap-6">
            <div className="relative h-[430px] w-full rounded-2xl overflow-hidden">
              <Image
                alt="Video thumbnail"
                src={ThumbNailImage1}
                fill
                sizes="700px"
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl cursor-pointer transition duration-300 hover:opacity-90 z-10">
                <Image
                  alt="YouTube"
                  src={YoutubeIcon}
                  width={64}
                  height={64}
                  className="w-[64px] h-[64px]"
                />
              </div>
            </div>
            <div>
              <h6 className="text-primary dark:text-creamwhite font-medium">
                Nathan Collins
              </h6>
              <p className="text-primary/70 dark:text-creamwhite/70 ">
                UX Designer @CreativeEdge
              </p>
            </div>
          </div>
          <div className="relative flex flex-col gap-6">
            <div className="relative h-[430px] w-full rounded-2xl overflow-hidden">
              <Image
                alt="Video thumbnail"
                src={ThumbNailImage2}
                fill
                sizes="700px"
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl cursor-pointer transition duration-300 hover:opacity-90 z-10">
                <Image
                  alt="YouTube"
                  src={YoutubeIcon}
                  width={64}
                  height={64}
                  className="w-[64px] h-[64px]"
                />
              </div>
            </div>
            <div>
              <h6 className="text-primary dark:text-creamwhite font-medium">
                Nathan Collins
              </h6>
              <p className="text-primary/70 dark:text-creamwhite/70 ">
                UX Designer @CreativeEdge
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row item-start gap-8 md:gap-16">
          <Image
            alt="image"
            src={Comma}
            width={96}
            height={96}
            className="w-[96px] h-[96px]"
          />
          <div className="flex flex-col gap-6">
            <h4>
              This masterclass boosted my marketing strategies with actionable
              insights. I achieved higher engagement and ROI, making data-driven
              decisions confidently.
            </h4>
            <div className="">
              <h6 className="text-primary dark:text-creamwhite font-medium">
                Daniel Cooper
              </h6>
              <p className="text-primary/70 dark:text-creamwhite/70">
                Growth Hacker @RocketPath
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
