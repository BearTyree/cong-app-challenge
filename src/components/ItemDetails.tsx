"use client"

interface Giver {
  name: string
  rating: number
  totalGiven: number
}

interface ItemDetailsProps {
  title: string
  condition: string
  giver: Giver
  availableUntil: string
  listed: string
  views: number
  onRequestPickup: () => void
  onSave: () => void
}

export default function ItemDetails({
  title,
  condition,
  giver,
  availableUntil,
  listed,
  views,
  onRequestPickup,
  onSave
}: ItemDetailsProps) {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <div className="flex items-center gap-4 mb-4">
          <span className="px-4 py-2 bg-[#e8f5e9] text-[#2e5a1f] rounded-full font-semibold">
            FREE
          </span>
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
            {condition}
          </span>
        </div>
      </div>

      <div className="border-t border-b py-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="font-semibold text-lg">{giver.name}</p>
            <p className="text-gray-600 text-sm">
              ⭐ {giver.rating} · {giver.totalGiven} items given
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-2">Available until {availableUntil}</p>
        <p className="text-sm text-gray-600">Listed {listed} · {views} views</p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onRequestPickup}
          className="flex-1 bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition"
        >
          Request Pickup
        </button>
        <button
          onClick={onSave}
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          Save
        </button>
      </div>
    </div>
  )
}