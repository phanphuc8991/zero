import Image from "next/image";
export function PillButton(props: any) {
  const { label, icon, href } = props;

  return (
    <a
      href={href}
      className="h-auto shadow-[0_6px_0_0_rgba(0,0,0,1)] hover:hover:shadow-[0_4px_0_0_rgba(0,0,0,1)] group flex items-center justify-center gap-2 bg-secondary hover:bg-transparent dark:hover:bg-creamwhite py-4 px-7 rounded-full border border-black w-full transition-all duration-300 ease-in-out"
    >
      <span className="font-semibold dark:group-hover:text-primary">
        {label}
      </span>
      {icon && (
        <Image
          alt="down-arrow-icon"
          src={icon}
          width={20}
          height={20}
          className="w-5 h-5"
        />
      )}
    </a>
  );
}
