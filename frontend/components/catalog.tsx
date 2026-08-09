"use client"

import { useEffect, useState } from "react"
import { IconPackageOff, IconRefresh } from "@tabler/icons-react"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { apiFetch, type Category, type ProductList } from "@/lib/shop"
import { cn } from "@/lib/utils"
import { useSearch } from "@/components/search-provider"

export function Catalog({
  initialCategories,
  initialData,
}: {
  initialCategories?: Category[]
  initialData?: ProductList
}) {
  const [categories, setCategories] = useState<Category[]>(initialCategories ?? [])
  const [data, setData] = useState<ProductList | null>(initialData ?? null)
  const [active, setActive] = useState<number | null>(null)
  const [error, setError] = useState(false)
  const [retry, setRetry] = useState(0)
  const [isLoading, setLoading] = useState(!initialData)
  const { debouncedQuery } = useSearch()

  useEffect(() => {
    if (initialCategories) return
    apiFetch<Category[]>("/api/categories").then(setCategories).catch(() => setError(true))
  }, [initialCategories, retry])

  useEffect(() => {
    if (!debouncedQuery && active === null && initialData) return

    const controller = new AbortController()
    const params = new URLSearchParams({ limit: "24" })
    if (debouncedQuery) params.set("q", debouncedQuery)
    if (active !== null) params.set("category_id", String(active))

    const timer = window.setTimeout(() => {
      setLoading(true)
      setError(false)
      apiFetch<ProductList>(`/api/products?${params}`, { signal: controller.signal })
        .then(setData)
        .catch((requestError: unknown) => {
          if (!(requestError instanceof DOMException && requestError.name === "AbortError")) setError(true)
        })
        .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    }, 0)

    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [active, debouncedQuery, initialData, retry])

  const usesInitialData = !debouncedQuery && active === null && Boolean(initialData)
  const displayedData = usesInitialData ? initialData : data
  const displayedError = usesInitialData ? false : error
  const displayedLoading = usesInitialData ? false : isLoading
  const products = displayedData?.products ?? []

  return (
    <section id="catalog" className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div className="max-w-xl">
          <p className="mb-2 text-sm font-medium text-neutral-400">New collection</p>
          <h2 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Shop all</h2>
        </div>
        {displayedData ? <p className="text-sm text-muted-foreground">{debouncedQuery ? `Search results for “${debouncedQuery}” — ` : ""}{displayedData.total} products</p> : null}
      </div>

      <div className="flex flex-wrap gap-2" aria-label="Product categories">
        <Button variant={active === null ? "default" : "outline"} size="sm" onClick={() => setActive(null)}>All products</Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={active === category.id ? "default" : "outline"}
            size="sm"
            className={cn(active === category.id && "pointer-events-none")}
            onClick={() => setActive(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </div>

      {displayedLoading && !displayedData ? (
        <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-busy="true">
          {Array.from({ length: 8 }).map((_, index) => <Skeleton key={index} className="aspect-[3/5] rounded-xl" />)}
        </div>
      ) : displayedError ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon"><IconPackageOff /></EmptyMedia>
            <EmptyTitle>Could not load the catalog</EmptyTitle>
            <EmptyDescription>Make sure the backend is running and available at the configured address.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent><Button variant="outline" onClick={() => { setError(false); setRetry((value) => value + 1) }}><IconRefresh data-icon="inline-start" />Try again</Button></EmptyContent>
        </Empty>
      ) : products.length ? (
        <div className={cn("grid gap-x-5 gap-y-10 transition-opacity sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", displayedLoading && "pointer-events-none opacity-50")} aria-busy={displayedLoading}>
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      ) : (
        <Empty className="border">
          <EmptyHeader><EmptyTitle>{debouncedQuery ? `No results for “${debouncedQuery}”` : "No products in this category yet"}</EmptyTitle><EmptyDescription>{debouncedQuery ? "Try a shorter or more general search term." : "Try choosing another category."}</EmptyDescription></EmptyHeader>
        </Empty>
      )}
    </section>
  )
}
