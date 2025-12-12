// app/components/Header.tsx
import Link from "next/link";
import Image from "next/image";
import transparentLogo from "@/public/ABO_Logo_Transparent.png";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-subtle shadow-sm">
      <nav className="container-main h-20 flex items-center justify-between px-8">
        {/* 로고 */}
        <Link href="/" className="flex items-center" aria-label="ABO MEDIA Home">
          <Image 
            src={transparentLogo} 
            alt="ABO MEDIA 로고" 
            width={160} 
            height={50} 
            priority 
          />
        </Link>

        {/* GNB */}
        <div className="flex items-center gap-8 text-[15px] font-semibold mr-6">
          <Link href="/about" className="hover:text-[var(--brand)] transition-colors">
            About
          </Link>
          <Link href="/business" className="hover:text-[var(--brand)] transition-colors">
            Business
          </Link>
          <Link href="/works" className="hover:text-[var(--brand)] transition-colors">
            Works
          </Link>
          <Link href="/news" className="hover:text-[var(--brand)] transition-colors">
            News
          </Link>
          <Link href="/clients" className="hover:text-[var(--brand)] transition-colors">
            Clients
          </Link>
          <Link href="/contact" className="hover:text-[var(--brand)] transition-colors">
            Contact
          </Link>
        </div>
      </nav>
    </header>
  );
}