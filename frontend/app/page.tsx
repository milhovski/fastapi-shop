import { Suspense } from "react"
import { connection } from "next/server"
import { Catalog } from "@/components/catalog"
import { Skeleton } from "@/components/ui/skeleton"
import { getCatalog } from "@/lib/server-shop"

async function CatalogContent() {
  await connection()
  const { categories, products } = await getCatalog()
  return <Catalog initialCategories={categories} initialData={products} />
}

function CatalogFallback() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
      <Skeleton className="mb-8 h-12 w-80 max-w-full" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => <Skeleton key={index} className="aspect-[3/5] rounded-xl" />)}
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <main>
      <Suspense fallback={<CatalogFallback />}>
        <CatalogContent />
      </Suspense>
    </main>
  )
}
