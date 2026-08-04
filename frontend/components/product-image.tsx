import { IconPhoto } from "@tabler/icons-react"
import { imageUrl } from "@/lib/shop"
import { cn } from "@/lib/utils"

export function ProductImage({ src, alt, className }: { src: string | null; alt: string; className?: string }) {
  const url = imageUrl(src)
  return (
    <div className={cn("relative flex aspect-[4/5] items-center justify-center overflow-hidden bg-muted", className)}>
      {url ? (
        // Backend controls product image URLs, including its local /static mount.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt={alt} className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
      ) : (
        <IconPhoto className="size-10 text-muted-foreground/40" stroke={1.25} aria-hidden="true" />
      )}
    </div>
  )
}
