"use client"

import { IconMinus, IconPlus, IconShoppingBag, IconTrash } from "@tabler/icons-react"
import { useCart } from "@/components/cart-provider"
import { ProductImage } from "@/components/product-image"
import { Button } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { formatPrice } from "@/lib/shop"

export function CartSheet() {
  const { details, isLoading, isOpen, setOpen, update, remove } = useCart()

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Cart</SheetTitle>
          <SheetDescription>{details?.items_count ? `${details.items_count} items in your cart` : "Your selected products"}</SheetDescription>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4">
          {isLoading && !details ? (
            Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-24 w-full" />)
          ) : details?.items.length ? (
            details.items.map((item) => (
              <div key={item.product_id} className="flex gap-3">
                <ProductImage src={item.image_url} alt={item.name} className="size-24 shrink-0 rounded-lg" />
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="line-clamp-2 font-medium leading-tight">{item.name}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{formatPrice(item.price)}</p>
                    </div>
                    <Button variant="ghost" size="icon-sm" aria-label={`Remove ${item.name}`} onClick={() => remove(item.product_id)}>
                      <IconTrash />
                    </Button>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="icon-sm" aria-label="Decrease quantity" onClick={() => update(item.product_id, item.quantity - 1)}>
                      <IconMinus />
                    </Button>
                    <span className="min-w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <Button variant="outline" size="icon-sm" aria-label="Increase quantity" onClick={() => update(item.product_id, item.quantity + 1)}>
                      <IconPlus />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <Empty className="my-auto border-0">
              <EmptyHeader>
                <EmptyMedia variant="icon"><IconShoppingBag /></EmptyMedia>
                <EmptyTitle>Your cart is empty</EmptyTitle>
                <EmptyDescription>Add something from the catalog and it will appear here.</EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button variant="outline" onClick={() => setOpen(false)}>Continue shopping</Button>
              </EmptyContent>
            </Empty>
          )}
        </div>

        {details?.items.length ? (
          <SheetFooter className="mt-auto">
            <Separator />
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-semibold tracking-tight">{formatPrice(details.total)}</p>
              </div>
              <p className="text-sm text-muted-foreground">Checkout unavailable</p>
            </div>
          </SheetFooter>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
