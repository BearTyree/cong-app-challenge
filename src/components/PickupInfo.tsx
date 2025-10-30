interface PickupInfoProps {
  address: string
  instructions?: string | null
}

export default function PickupInfo({ address, instructions }: PickupInfoProps) {
  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-3">Pickup Information</h3>
      <div className="space-y-2 text-gray-700">
        <p className="break-words overflow-wrap-anywhere">{address}</p>
        {instructions && <p className="break-words overflow-wrap-anywhere">{instructions}</p>}
      </div>
    </div>
  )
}
