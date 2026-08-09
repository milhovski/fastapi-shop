"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"

type SearchContextValue = {
  query: string
  debouncedQuery: string
  setQuery: (query: string) => void
}

const SearchContext = createContext<SearchContextValue | null>(null)

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const initialQuery = new URLSearchParams(window.location.search).get("q") ?? ""
      setQuery(initialQuery)
      setDebouncedQuery(initialQuery.trim())
      setInitialized(true)
    }, 0)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query.trim()), 300)
    return () => window.clearTimeout(timer)
  }, [query])

  useEffect(() => {
    if (!initialized || window.location.pathname !== "/") return
    const url = new URL(window.location.href)
    if (debouncedQuery) url.searchParams.set("q", debouncedQuery)
    else url.searchParams.delete("q")
    window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`)
  }, [debouncedQuery, initialized])

  const value = useMemo(() => ({ query, debouncedQuery, setQuery }), [query, debouncedQuery])
  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
}

export function useSearch() {
  const context = useContext(SearchContext)
  if (!context) throw new Error("useSearch must be used inside SearchProvider")
  return context
}
