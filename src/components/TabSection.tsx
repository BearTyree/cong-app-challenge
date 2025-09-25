"use client"
import { ReactNode } from "react"

interface Tab {
  id: string
  label: string
  content: ReactNode
}

interface TabSectionProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
}

export default function TabSection({ tabs, activeTab, onTabChange }: TabSectionProps) {
  return (
    <div className="mb-12">
      <div className="flex gap-6 border-b mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`pb-3 px-1 ${
              activeTab === tab.id
                ? "border-b-2 border-black font-semibold"
                : "text-gray-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="max-w-3xl">
        {tabs.find(tab => tab.id === activeTab)?.content}
      </div>
    </div>
  )
}