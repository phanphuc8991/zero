import { Statistic } from "@/app/components/ui/Statistic";
import { SectionHeader } from "@/app/components/ui/SectionHeader";
const list = [
  {
    count: "150",
    label: "Courses availabel",
  },
  {
    count: "75",
    label: "Industry experts",
  },
  {
    count: "10",
    label: "Years in industry",
  },
  {
    count: "1,000",
    label: "Certificates to earn",
  },
];
export function AboutUs() {
  return (
    <div className="container">
      <div className="py-11 md:py-20 flex flex-col gap-10 md:gap-12">
        <SectionHeader
          label="About us"
          heading="Empowering learners with expert-led courses, fostering growth, building confidence, and unlocking career opportunities."
        />
        <div className="grid md:grid-cols-4 xsm:grid-cols-2 grid-cols-1 md:pt-6 gap-5 lg:gap-6 text-center md:text-left">
          {list.map((item, index) => (
            <Statistic data={item} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
