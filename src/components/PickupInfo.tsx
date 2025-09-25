interface PickupInfoProps {
  address: string
  availableDays: string
  distance: string
}

export default function PickupInfo({ address, availableDays, distance }: PickupInfoProps) {
  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-3">Pickup Information</h3>
      <div className="space-y-2 text-gray-700">
        <p>📍 {address}</p>
        <p>📅 {availableDays}</p>
        <p>📏 {distance}</p>
      </div>
    </div>
  )
}