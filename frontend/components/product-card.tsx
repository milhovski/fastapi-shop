"use client"

import Link from "next/link"
import { IconHeart, IconShoppingBag } from "@tabler/icons-react"
import { useCart } from "@/components/cart-provider"
import { ProductImage } from "@/components/product-image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPrice, type Product } from "@/lib/shop"

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart()
  return (
    <Card className="group h-full gap-0 overflow-visible rounded-none border-0 bg-transparent py-0 shadow-none ring-0">
      <Link href={`/products/${product.id}`} className="relative block overflow-hidden rounded-md bg-[#f3f2ef]">
        <ProductImage src={product.image_url} alt={product.name} className="aspect-[4/4.7] bg-[#f3f2ef]" />
        <span className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-white/95 shadow-sm transition-transform group-hover:scale-105"><IconHeart className="size-4" /></span>
      </Link>
      <CardHeader className="min-h-31 gap-1.5 px-0 pb-0 pt-4">
        <Badge variant="secondary" className="mb-1 w-fit rounded-sm px-2 py-0.5 font-normal">{product.category.name}</Badge>
        <CardTitle className="line-clamp-1 text-base font-semibold">
          <Link href={`/products/${product.id}`}>{product.name}</Link>
        </CardTitle>
        <CardDescription className="line-clamp-2 leading-5">{product.description || "A thoughtfully designed essential for everyday life."}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto px-0 pb-4 pt-2">
        <p className="text-xl font-semibold tracking-[-0.03em]">{formatPrice(product.price)}</p>
      </CardContent>
      <CardFooter className="border-0 bg-transparent p-0">
        <Button className="h-11 w-full rounded-md bg-black hover:bg-neutral-800" onClick={() => add(product.id)}>
          <IconShoppingBag data-icon="inline-start" />
          Add to cart
        </Button>
      </CardFooter>
    </Card>
  )
}
