import Link from "next/link";
import Image from "next/image";
export function MarqueeItem(props: any) {
  const { data } = props;
  return (
    <div className="w-[350px] h-auto group relative">
      <Link
        href={data.link}
        className="rounded-3xl overflow-hidden block w-80 h-105 relative overflow-hidden"
      >
        <Image
          alt="Ethan Walker"
          src={data.src}
          fill
          sizes="350px"
          className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
          priority
        />
      </Link>
      <div className="absolute flex flex-col gap-4 p-6 bottom-0">
        <Link href={data.link}>
          <h5 className="text-white group-hover:text-secondary">{data.name}</h5>
        </Link>
        <p className="text-white font-normal py-2 px-5 border border-white rounded-full">
          {data.profession}
        </p>
      </div>
    </div>
  );
}
