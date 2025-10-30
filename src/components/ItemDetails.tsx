interface ItemDetailsProps {
  title: string
  categoryLabel: string
  condition: string
}

export default function ItemDetails({
  title,
  categoryLabel,
  condition
}: ItemDetailsProps) {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-gray-900">{title}</h1>

      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <dt className="text-sm text-gray-600">Category</dt>
          <dd className="font-semibold">{categoryLabel}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-600">Condition</dt>
          <dd className="font-semibold capitalize">{condition}</dd>
        </div>
      </dl>
    </div>
  )
}
