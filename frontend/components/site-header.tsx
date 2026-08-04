"use client"

import Link from "next/link"
import { IconShoppingBag } from "@tabler/icons-react"
import { useCart } from "@/components/cart-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  const { count, setOpen } = useCart()
  return (
    <header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link href="/" className="flex items-baseline gap-2" aria-label="Forma — на главную">
          <span className="text-xl font-semibold tracking-[-0.04em]">FORMA</span>
          <span className="hidden text-xs text-muted-foreground sm:inline">вещи для жизни</span>
        </Link>
        <Button variant="outline" onClick={() => setOpen(true)}>
          <IconShoppingBag data-icon="inline-start" />
          Корзина
          {count > 0 ? <Badge variant="secondary">{count}</Badge> : null}
        </Button>
      </div>
    </header>
  )
}
