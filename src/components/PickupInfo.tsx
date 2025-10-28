interface PickupInfoProps {
  address: string
  availabilitySummary: string
  instructions?: string | null
}

export default function PickupInfo({ address, availabilitySummary, instructions }: PickupInfoProps) {
  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-3">Pickup Information</h3>
      <div className="space-y-2 text-gray-700">
        <p>📍 {address}</p>
        <p>📅 {availabilitySummary}</p>
        {instructions ? <p>📝 {instructions}</p> : null}
      </div>
    </div>
  )
}
