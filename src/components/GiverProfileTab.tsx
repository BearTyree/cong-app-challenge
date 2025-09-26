interface GiverProfileTabProps {
  giver: {
    name: string
    rating: number
    totalGiven: number
    memberSince: string
    bio: string
  }
}

export default function GiverProfileTab({ giver }: GiverProfileTabProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">{giver.name}</h3>
      <div className="grid grid-cols-3 gap-4 max-w-md">
        <div>
          <p className="text-sm text-gray-600">Rating</p>
          <p className="font-semibold">⭐ {giver.rating}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Items Given</p>
          <p className="font-semibold">{giver.totalGiven}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Member Since</p>
          <p className="font-semibold">{giver.memberSince}</p>
        </div>
      </div>
      <p className="text-gray-700">{giver.bio}</p>
    </div>
  )
}