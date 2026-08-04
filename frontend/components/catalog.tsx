"use client"

import { useEffect, useMemo, useState } from "react"
import { IconPackageOff, IconRefresh } from "@tabler/icons-react"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { apiFetch, type Category, type ProductList } from "@/lib/shop"
import { cn } from "@/lib/utils"

export function Catalog() {
  const [categories, setCategories] = useState<Category[]>([])
  const [data, setData] = useState<ProductList | null>(null)
  const [active, setActive] = useState<number | null>(null)
  const [error, setError] = useState(false)
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    Promise.all([apiFetch<Category[]>("/api/categories"), apiFetch<ProductList>("/api/products")])
      .then(([categoryList, products]) => {
        setCategories(categoryList)
        setData(products)
      })
      .catch(() => setError(true))
  }, [retry])

  const products = useMemo(
    () => data?.products.filter((product) => active === null || product.category_id === active) ?? [],
    [active, data],
  )

  return (
    <section id="catalog" className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-16 lg:px-8 lg:py-24">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div className="max-w-xl">
          <p className="mb-2 text-sm font-medium text-primary">Каталог</p>
          <h2 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Выберите то, что останется надолго</h2>
        </div>
        {data ? <p className="text-sm text-muted-foreground">{products.length} из {data.total} товаров</p> : null}
      </div>

      <div className="flex flex-wrap gap-2" aria-label="Категории товаров">
        <Button variant={active === null ? "default" : "outline"} size="sm" onClick={() => setActive(null)}>Все товары</Button>
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

      {!data && !error ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => <Skeleton key={index} className="aspect-[3/5] rounded-xl" />)}
        </div>
      ) : error ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon"><IconPackageOff /></EmptyMedia>
            <EmptyTitle>Не удалось загрузить каталог</EmptyTitle>
            <EmptyDescription>Проверьте, что backend запущен и доступен на настроенном адресе.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent><Button variant="outline" onClick={() => { setError(false); setRetry((value) => value + 1) }}><IconRefresh data-icon="inline-start" />Повторить</Button></EmptyContent>
        </Empty>
      ) : products.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      ) : (
        <Empty className="border">
          <EmptyHeader><EmptyTitle>В этой категории пока пусто</EmptyTitle><EmptyDescription>Попробуйте выбрать другую категорию.</EmptyDescription></EmptyHeader>
        </Empty>
      )}
    </section>
  )
}
