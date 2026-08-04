import { IconArrowDownRight, IconSparkles } from "@tabler/icons-react"
import { Catalog } from "@/components/catalog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main>
      <section className="mx-auto grid min-h-[72vh] max-w-7xl items-center gap-10 px-5 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
        <div>
          <Badge variant="secondary" className="mb-6"><IconSparkles data-icon="inline-start" />Новая коллекция</Badge>
          <h1 className="max-w-4xl text-5xl font-semibold leading-[0.98] tracking-[-0.065em] sm:text-7xl lg:text-8xl">Меньше вещей. Больше смысла.</h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground">Современные товары для дома и повседневной жизни — спокойные, функциональные и созданные надолго.</p>
          <Button size="lg" className="mt-8" render={<a href="#catalog" />} nativeButton={false}><IconArrowDownRight data-icon="inline-start" />Смотреть каталог</Button>
        </div>
        <div className="relative hidden aspect-[4/5] overflow-hidden rounded-3xl bg-primary lg:block">
          <div className="absolute inset-8 rounded-full border border-primary-foreground/25" />
          <div className="absolute inset-20 rounded-full border border-primary-foreground/20" />
          <div className="absolute bottom-10 left-10 max-w-xs text-primary-foreground">
            <p className="text-sm opacity-70">FORMA / 2026</p>
            <p className="mt-2 text-3xl font-medium tracking-tight">Честный дизайн для каждого дня.</p>
          </div>
        </div>
      </section>
      <Catalog />
    </main>
  )
}
