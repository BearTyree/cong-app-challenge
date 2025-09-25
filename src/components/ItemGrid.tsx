import { ReactNode } from "react"

interface ItemGridProps {
  title: string
  children: ReactNode
}

export default function ItemGrid({ title, children }: ItemGridProps) {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {children}
      </div>
    </div>
  )
}