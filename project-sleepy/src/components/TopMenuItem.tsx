"use client";

import Link from "next/link";

interface Props {
  title: string;
  pageRef: string;
}

export default function TopmenuItem({ title, pageRef }: Props) {
  return (
    <Link
      href={pageRef}
      className="text-white hover:underline px-2 py-1 text-sm"
    >
      {title}
    </Link>
  );
}
