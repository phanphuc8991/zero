import PlayDarkIcon from "@/assets/images/icon/play-dark-icon.svg";
import PlayLightIcon from "@/assets/images/icon/play-light-icon.svg";
import Link from "next/link";
import Image from "next/image";

export function CardCourse(props: any) {
  const { data } = props;
  return (
    <div className="group border-primary/20 dark:border-creamwhite/20 border rounded-2xl flex flex-col overflow-hidden">
      <div className="overflow-hidden">
        <Link href="" className="h-52 w-full relative block">
          <Image
            src={data.coverImage}
            alt="course-item-image"
            fill
            sizes="400px"
            className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
            loading="eager"
          />
        </Link>
      </div>
      <div className="p-6 flex flex-col justify-center flex-1">
        <div className="flex flex-col justify-center gap-4">
          <Link href="">
            <h5 className="max-w-72 group-hover:text-secondary">
              {data.title}
            </h5>
          </Link>
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
              <span>{data.duration}</span>
              <span>hours</span>
            </p>
          </div>
        </div>
        <div className="mt-12 flex items-center gap-3">
          <Link
            href=""
            className="h-10 w-10 block rounded-full overflow-hidden"
          >
            <Image
              src={data.instructor.avatar}
              width={40}
              height={40}
              alt="course-owner"
              className="w-10 h-10"
            />
          </Link>
          <div className="flex flex-col justify-center">
            <Link href="">
              <h6>{data.instructor.name}</h6>
            </Link>
            <p className="text-primary/70 dark:text-creamwhite/70">
              {data.instructor.title}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
