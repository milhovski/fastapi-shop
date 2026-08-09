export type Category = {
  id: number;
  name: string;
  slug: string;
};

export type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category_id: number;
  image_url: string | null;
  created_at: string;
  category: Category;
};

export type ProductList = {
  products: Product[];
  total: number;
};

export type CartMap = Record<number, number>;

export type CartDetails = {
  items: Array<{
    product_id: number;
    name: string;
    price: number;
    quantity: number;
    subtotal: number;
    image_url: string | null;
  }>;
  total: number;
  items_count: number;
};

export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"
).replace(/\/$/, "");

export function imageUrl(value: string | null) {
  if (!value) return null;
  if (/^https?:\/\//.test(value)) return value;
  return `${API_URL}${value.startsWith("/") ? "" : "/"}${value}`;
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });

  if (!response.ok) throw new Error(`API returned ${response.status}`);
  return response.json() as Promise<T>;
}
