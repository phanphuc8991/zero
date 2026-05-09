import { MarqueeItem } from "@/app/components/ui/MarqueeItem";
import image_1 from "@/assets/images/home/profile-img-1.png";
import image_2 from "@/assets/images/home/profile-img-2.png";
import image_3 from "@/assets/images/home/profile-img-3.png";
import image_4 from "@/assets/images/home/profile-img-4.png";
import image_5 from "@/assets/images/home/profile-img-5.png";
const list = [
  {
    link: "",
    src: image_1,
    name: "Ethan Walker",
    profession: "Al Content Strategist",
  },
  {
    link: "",
    src: image_2,
    name: "Ethan Walker",
    profession: "Al Content Strategist",
  },
  {
    link: "",
    src: image_3,
    name: "Ethan Walker",
    profession: "Al Content Strategist",
  },
  {
    link: "",
    src: image_4,
    name: "Ethan Walker",
    profession: "Al Content Strategist",
  },
  {
    link: "",
    src: image_5,
    name: "Ethan Walker",
    profession: "Al Content Strategist",
  },
];

export function CardMarquee() {
  return (
    <div className="relative w-full h-auto overflow-hidden">
      <div className="flex animation-slider-log w-[5250px] hover:[animation-play-state:paused]">
        {[...list, ...list].map((data,index) => (
          <MarqueeItem data={data} key={index} />
        ))}
      </div>
    </div>
  );
}
