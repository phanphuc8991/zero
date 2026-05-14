import Image from "next/image";

import Link from "next/link";

export function CardBlog(props: any) {
  const { data } = props;
  return (
    <div className="group flex flex-col gap-2.5 md:gap-5">
      <Link
        href=""
        className=" overflow-hidden block rounded-2xl h-96 w-full relative"
      >
        <Image
          alt="image"
          src={data.image}
          fill
          className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
          unoptimized
        />
      </Link>

      <div className="flex flex-col md:gap-2">
        <p className="text-primary/70 dark:text-creamwhite/70">{data.date}</p>
        <Link href="">
          <h5 className="group-hover:text-secondary">{data.title}</h5>
        </Link>
      </div>
    </div>
  );
}
