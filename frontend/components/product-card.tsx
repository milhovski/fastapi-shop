"use client"

import Link from "next/link"
import { IconArrowUpRight, IconShoppingBag } from "@tabler/icons-react"
import { useCart } from "@/components/cart-provider"
import { ProductImage } from "@/components/product-image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPrice, type Product } from "@/lib/shop"

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart()
  return (
    <Card className="group h-full pt-0">
      <Link href={`/products/${product.id}`} className="block overflow-hidden rounded-t-xl">
        <ProductImage src={product.image_url} alt={product.name} />
      </Link>
      <CardHeader>
        <Badge variant="secondary">{product.category.name}</Badge>
        <CardAction>
          <Button variant="ghost" size="icon-sm" render={<Link href={`/products/${product.id}`} aria-label={`Открыть ${product.name}`} />} nativeButton={false}>
            <IconArrowUpRight />
          </Button>
        </CardAction>
        <CardTitle className="line-clamp-2 text-base">
          <Link href={`/products/${product.id}`}>{product.name}</Link>
        </CardTitle>
        <CardDescription className="line-clamp-2">{product.description || "Продуманная вещь для повседневной жизни."}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto">
        <p className="text-lg font-semibold tracking-tight">{formatPrice(product.price)}</p>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={() => add(product.id)}>
          <IconShoppingBag data-icon="inline-start" />
          В корзину
        </Button>
      </CardFooter>
    </Card>
  )
}
