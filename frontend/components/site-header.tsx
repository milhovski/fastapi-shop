"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  IconMenu2,
  IconSearch,
  IconShoppingBag,
} from "@tabler/icons-react";
import { useCart } from "@/components/cart-provider";
import { useSearch } from "@/components/search-provider";

export function SiteHeader() {
  const { count, setOpen } = useCart();
  const { query, setQuery } = useSearch();
  const router = useRouter();

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = query.trim();
    router.push(normalized ? `/?q=${encodeURIComponent(normalized)}` : "/");
  }
  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto max-w-360 px-5 sm:px-8 lg:px-12">
        <div className="flex h-20 items-center justify-between gap-6 lg:h-24">
          <Link
            href="/"
            className="shrink-0 text-2xl font-black tracking-[-0.08em]"
            aria-label="Shop"
          >
            Shop
          </Link>
          <form onSubmit={submitSearch} role="search" className="hidden h-11 w-full max-w-md items-center gap-3 rounded-sm bg-neutral-100 px-4 text-neutral-400 md:flex">
            <IconSearch className="size-5" stroke={1.6} />
            <input
              className="w-full bg-transparent text-sm text-black outline-none placeholder:text-neutral-400"
              placeholder="Search"
              aria-label="Search products"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </form>
          <div className="flex items-center gap-2 sm:gap-5">
            <button
              onClick={() => setOpen(true)}
              className="relative flex min-w-11 flex-col items-center gap-1 text-[11px]"
              aria-label={`Cart, items: ${count}`}
            >
              <IconShoppingBag className="size-6" stroke={1.7} />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-2 grid size-5 place-items-center rounded-full bg-[#f2d45c] text-[10px] font-semibold">
                  {count}
                </span>
              )}
              <span className="hidden sm:block">Cart</span>
            </button>
            <button
              className="grid size-10 place-items-center md:hidden"
              aria-label="Open menu"
            >
              <IconMenu2 />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
