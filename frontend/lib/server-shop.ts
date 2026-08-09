import "server-only"

import { cacheLife, cacheTag } from "next/cache"
import type { Category, Product, ProductList } from "@/lib/shop"

const API_URL = (process.env.API_URL ?? "http://localhost:8000").replace(/\/$/, "")

async function serverApiFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(10_000),
  })

  if (!response.ok) throw new Error(`API returned ${response.status} for ${path}`)
  return response.json() as Promise<T>
}

export async function getCatalog(): Promise<{ categories: Category[]; products: ProductList }> {
  "use cache"
  cacheLife("hours")
  cacheTag("catalog", "categories", "products")

  const [categories, products] = await Promise.all([
    serverApiFetch<Category[]>("/api/categories"),
    serverApiFetch<ProductList>("/api/products"),
  ])
  return { categories, products }
}

export async function getProduct(id: string): Promise<Product> {
  "use cache"
  cacheLife("hours")
  cacheTag("products", `product-${id}`)
  return serverApiFetch<Product>(`/api/products/${encodeURIComponent(id)}`)
}
