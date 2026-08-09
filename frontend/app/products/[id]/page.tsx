import { Suspense } from "react"
import { ProductShowcase } from "@/components/product-showcase"
import { Skeleton } from "@/components/ui/skeleton"
import { getProduct } from "@/lib/server-shop"

async function ProductContent({ params }: Pick<PageProps<"/products/[id]">, "params">) {
  const { id } = await params
  const product = await getProduct(id)
  return <ProductShowcase id={id} initialProduct={product} />
}

function ProductFallback() {
  return (
    <main className="mx-auto grid max-w-7xl gap-10 px-5 py-10 md:grid-cols-2 md:px-8 lg:py-16">
      <Skeleton className="aspect-[4/5] rounded-2xl" />
      <div className="flex flex-col gap-5 py-6"><Skeleton className="h-6 w-28" /><Skeleton className="h-14 w-4/5" /><Skeleton className="h-24 w-full" /><Skeleton className="mt-auto h-12 w-full" /></div>
    </main>
  )
}

export default function ProductPage({ params }: PageProps<"/products/[id]">) {
  return (
    <Suspense fallback={<ProductFallback />}>
      <ProductContent params={params} />
    </Suspense>
  )
}
