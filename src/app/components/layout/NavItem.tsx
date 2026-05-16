import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

function removeAllSlashes(str: string) {
  return str.replace(/\//g, "");
}

export function NavItem({
  data,
  onMounted,
}: {
  data: any;
  onMounted: () => void;
}) {
  const { href, text } = data;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeHash, setActiveHash] = useState("");
  useEffect(() => {
    onMounted();
    setActiveHash(window.location.hash || "");
  }, [pathname, searchParams]);

  const isAnchor = removeAllSlashes(href).startsWith("#");
  const isActive = isAnchor
    ? removeAllSlashes(activeHash) === removeAllSlashes(href)
    : pathname === href && !activeHash;

  return (
    <Link
      href={href}
      className={`dark:text-creamwhite text-base text-primary hover:text-secondary font-semibold ${isActive && "text-secondary"}`}
    >
      {text}
    </Link>
  );
}
