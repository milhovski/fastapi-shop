"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { apiFetch, type CartDetails, type CartMap } from "@/lib/shop"

type CartContextValue = {
  cart: CartMap
  details: CartDetails | null
  isLoading: boolean
  isOpen: boolean
  count: number
  setOpen: (open: boolean) => void
  add: (productId: number) => Promise<void>
  update: (productId: number, quantity: number) => Promise<void>
  remove: (productId: number) => Promise<void>
}

const CartContext = createContext<CartContextValue | null>(null)
const STORAGE_KEY = "forma-cart"

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartMap>({})
  const [details, setDetails] = useState<CartDetails | null>(null)
  const [isLoading, setLoading] = useState(false)
  const [isOpen, setOpen] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        setCart(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") as CartMap)
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
      setReady(true)
    }, 0)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!ready) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
    async function refreshDetails() {
      setLoading(true)
      try {
        setDetails(await apiFetch<CartDetails>("/api/cart", { method: "POST", body: JSON.stringify(cart) }))
      } catch {
        setDetails(null)
      } finally {
        setLoading(false)
      }
    }
    void refreshDetails()
  }, [cart, ready])

  async function add(productId: number) {
    const result = await apiFetch<{ cart: CartMap }>("/api/cart/add", {
      method: "POST",
      body: JSON.stringify({ product_id: productId, quantity: 1, cart }),
    })
    setCart(result.cart)
    setOpen(true)
  }

  async function update(productId: number, quantity: number) {
    if (quantity <= 0) return remove(productId)
    const result = await apiFetch<{ cart: CartMap }>("/api/cart/update", {
      method: "POST",
      body: JSON.stringify({ product_id: productId, quantity, cart }),
    })
    setCart(result.cart)
  }

  async function remove(productId: number) {
    const result = await apiFetch<{ cart: CartMap }>(`/api/cart/remove/${productId}`, {
      method: "POST",
      body: JSON.stringify({ cart }),
    })
    setCart(result.cart)
  }

  const count = useMemo(() => Object.values(cart).reduce((sum, quantity) => sum + quantity, 0), [cart])

  return (
    <CartContext.Provider value={{ cart, details, isLoading, isOpen, count, setOpen, add, update, remove }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart must be used inside CartProvider")
  return context
}
