"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { IconArrowLeft, IconShoppingBag } from "@tabler/icons-react"
import { useCart } from "@/components/cart-provider"
import { ProductImage } from "@/components/product-image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { apiFetch, formatPrice, type Product } from "@/lib/shop"

export function ProductDetails({ id, initialProduct }: { id: string; initialProduct?: Product }) {
  const [product, setProduct] = useState<Product | null>(initialProduct ?? null)
  const [error, setError] = useState(false)
  const { add } = useCart()

  useEffect(() => {
    if (initialProduct) return
    apiFetch<Product>(`/api/products/${id}`).then(setProduct).catch(() => setError(true))
  }, [id, initialProduct])

  if (error) return (
    <main className="mx-auto flex min-h-[70vh] max-w-7xl items-center px-5 lg:px-8">
      <Empty className="w-full border">
        <EmptyHeader><EmptyTitle>Product not found</EmptyTitle><EmptyDescription>It may have been removed or the link may be outdated.</EmptyDescription></EmptyHeader>
        <EmptyContent><Button variant="outline" render={<Link href="/" />} nativeButton={false}><IconArrowLeft data-icon="inline-start" />Back to catalog</Button></EmptyContent>
      </Empty>
    </main>
  )

  if (!product) return (
    <main className="mx-auto grid max-w-7xl gap-10 px-5 py-10 lg:grid-cols-2 lg:px-8 lg:py-16">
      <Skeleton className="aspect-[4/5] rounded-2xl" />
      <div className="flex flex-col gap-5 py-6"><Skeleton className="h-6 w-28" /><Skeleton className="h-14 w-4/5" /><Skeleton className="h-24 w-full" /><Skeleton className="mt-auto h-12 w-full" /></div>
    </main>
  )

  return (
    <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-14">
      <Button variant="ghost" render={<Link href="/" />} nativeButton={false} className="mb-6"><IconArrowLeft data-icon="inline-start" />Back to catalog</Button>
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductImage src={product.image_url} alt={product.name} className="rounded-2xl" />
        <div className="flex flex-col py-2 lg:py-8">
          <Badge variant="secondary" className="mb-5 w-fit">{product.category.name}</Badge>
          <h1 className="text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">{product.name}</h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{product.description || "A thoughtfully designed essential for everyday life."}</p>
          <Separator className="my-8" />
          <div className="mt-auto flex flex-col gap-5">
            <div><p className="text-sm text-muted-foreground">Price</p><p className="text-3xl font-semibold tracking-tight">{formatPrice(product.price)}</p></div>
            <Button size="lg" onClick={() => add(product.id)}><IconShoppingBag data-icon="inline-start" />Add to cart</Button>
          </div>
        </div>
      </div>
    </main>
  )
}
