"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/src/config/site";

export function Header() {
  const pathname = usePathname();
  const isOnDemoPage = pathname === "/demos";
  return (
    <header className="border-b aegis-border-cyber/20 bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <img
                src="/aegis_logo.png"
                alt="AegisPay Logo"
                className="h-12 w-12"
              />
              <span className="text-xl font-bold aegis-text-cyber">
                {siteConfig.name}
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {siteConfig.navigation.main.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                target={item.target || "_self"}
                className="text-gray-300 hover:text-white transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          {!isOnDemoPage && (
            <div className="flex items-center space-x-4">
              <Button
                asChild
                className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-black font-medium"
              >
                <Link href="/demos">Launch App</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
