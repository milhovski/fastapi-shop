"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { IconArrowLeft, IconHeart, IconShoppingBag, IconStarFilled, IconTruckDelivery } from "@tabler/icons-react"
import { useCart } from "@/components/cart-provider"
import { ProductImage } from "@/components/product-image"
import { Button } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { apiFetch, formatPrice, type Product } from "@/lib/shop"
import { cn } from "@/lib/utils"

const sizes = ["40.5", "41", "42", "43", "43.5", "44", "44.5", "45", "46"]

export function ProductShowcase({ id, initialProduct }: { id: string; initialProduct?: Product }) {
  const [product, setProduct] = useState<Product | null>(initialProduct ?? null)
  const [error, setError] = useState(false)
  const [size, setSize] = useState("41")
  const [favorite, setFavorite] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const { add } = useCart()

  useEffect(() => {
    if (!initialProduct) apiFetch<Product>(`/api/products/${id}`).then(setProduct).catch(() => setError(true))
  }, [id, initialProduct])

  if (error) return <main className="mx-auto flex min-h-[70vh] max-w-7xl items-center px-5"><Empty className="w-full border"><EmptyHeader><EmptyTitle>Product not found</EmptyTitle><EmptyDescription>It may have been removed or the link may be outdated.</EmptyDescription></EmptyHeader><EmptyContent><Button variant="outline" render={<Link href="/" />} nativeButton={false}><IconArrowLeft data-icon="inline-start" />Back to catalog</Button></EmptyContent></Empty></main>
  if (!product) return <ProductLoading />

  return (
    <main className="mx-auto w-full max-w-[1440px] px-5 pb-14 pt-6 sm:px-8 lg:px-12 lg:pb-20">
      <nav className="mb-7 flex items-center gap-2 overflow-hidden text-xs text-neutral-500" aria-label="Breadcrumbs"><Link href="/">Clothing & footwear</Link><span>•</span><Link href="/">{product.category.name}</Link><span>•</span><span className="truncate text-black">{product.name}</span></nav>
      <div className="grid items-start gap-10 md:grid-cols-[minmax(0,1.08fr)_minmax(320px,.92fr)] md:gap-8 lg:gap-14 xl:gap-24">
        <section className="min-w-0" aria-label="Product photos">
          <ProductImage src={product.image_url} alt={product.name} className={cn("aspect-square max-h-[680px] rounded-md bg-[#f3f2ef] sm:aspect-[1.08/1]", activeImage === 3 && "[&_img]:scale-110")} />
          <div className="mt-4 grid grid-cols-5 gap-3">
            {[0, 1, 2, 3].map((index) => <button key={index} onClick={() => setActiveImage(index)} className={cn("overflow-hidden rounded-sm border bg-[#f3f2ef] transition", activeImage === index ? "border-black" : "border-transparent hover:border-neutral-300")} aria-label={`Photo ${index + 1}`}><ProductImage src={product.image_url} alt="" className={cn("aspect-square", index === 1 && "[&_img]:-translate-x-1", index === 2 && "[&_img]:scale-110", index === 3 && "[&_img]:rotate-[-8deg]")} /></button>)}
            <button className="aspect-square rounded-sm border border-neutral-100 text-xs font-medium hover:bg-neutral-50">+4 more</button>
          </div>
        </section>
        <section className="flex min-w-0 flex-col md:pt-1">
          <div className="mb-5 flex items-center justify-between gap-4 text-sm"><span className="inline-flex items-center gap-2 font-semibold"><span className="grid size-8 place-items-center rounded-full bg-black text-[10px] text-white">BR</span>{product.category.name}</span><span className="text-xs text-neutral-400">SKU {String(product.id).padStart(8, "0")}</span></div>
          <h1 className="max-w-xl text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl">{product.name}</h1>
          <div className="mt-4 flex items-center gap-3 text-sm"><span className="flex gap-0.5 text-[#e5c34b]">{Array.from({ length: 5 }).map((_, i) => <IconStarFilled key={i} className="size-4" />)}</span><span className="text-neutral-400">42 reviews</span></div>
          <p className="mt-8 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">{formatPrice(product.price)}</p>
          <div className="mt-10"><p className="mb-3 text-sm font-medium">Color <span className="ml-2 font-normal text-neutral-400">• White</span></p><div className="flex gap-3">{["bg-[#f0eee9]", "bg-neutral-300", "bg-black"].map((color, index) => <button key={color} className={cn("grid size-12 place-items-center border p-1", index === 0 ? "border-black" : "border-neutral-200")} aria-label={`Color ${index + 1}`}><span className={cn("size-full", color)} /></button>)}</div></div>
          <div className="mt-8"><p className="mb-3 text-sm font-medium">Size <span className="ml-2 font-normal text-neutral-400">• EU</span></p><div className="grid grid-cols-5 gap-2 xl:grid-cols-6">{sizes.map((item) => <button key={item} onClick={() => setSize(item)} className={cn("h-12 border text-sm transition-colors", size === item ? "border-black bg-black text-white" : "border-neutral-200 hover:border-black")}>{item}</button>)}</div><button className="mt-3 text-xs text-[#9f8b32] underline-offset-4 hover:underline">Size guide</button></div>
          {product.description && <p className="mt-7 line-clamp-2 text-sm leading-6 text-neutral-500">{product.description}</p>}
          <div className="mt-8 flex gap-3"><Button size="lg" className="h-14 flex-1 rounded-md bg-black text-base text-white hover:bg-neutral-800" onClick={() => add(product.id)}><IconShoppingBag data-icon="inline-start" />Add to cart</Button><Button variant="outline" size="icon-lg" className={cn("size-14 rounded-md", favorite && "border-black bg-black text-white hover:bg-black hover:text-white")} onClick={() => setFavorite((value) => !value)} aria-label="Add to favorites"><IconHeart className={cn("size-5", favorite && "fill-current")} /></Button></div>
          <p className="mt-4 flex items-center gap-3 text-xs"><IconTruckDelivery className="size-5" stroke={1.6} />Free delivery on orders over $30</p>
        </section>
      </div>
    </main>
  )
}

function ProductLoading() {
  return <main className="mx-auto grid w-full max-w-[1440px] gap-10 px-5 py-10 md:grid-cols-2 md:px-8 lg:px-12"><Skeleton className="aspect-square rounded-md" /><div className="flex flex-col gap-5 py-6"><Skeleton className="h-7 w-32" /><Skeleton className="h-12 w-4/5" /><Skeleton className="h-14 w-44" /><Skeleton className="mt-10 h-40 w-full" /><Skeleton className="mt-auto h-14 w-full" /></div></main>
}
