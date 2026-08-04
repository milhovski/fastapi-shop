import { ProductDetails } from "@/components/product-details"

export default async function ProductPage({ params }: PageProps<"/products/[id]">) {
  const { id } = await params
  return <ProductDetails id={id} />
}
