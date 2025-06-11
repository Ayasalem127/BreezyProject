"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function NavbarClient({ hideNavbar }) {
  const pathname = usePathname();
  const showNavbar = !hideNavbar.includes(pathname);

  if (!showNavbar) return null;

  return <Navbar />;
}