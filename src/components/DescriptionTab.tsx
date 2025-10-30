interface DescriptionTabProps {
  description: string
}

export default function DescriptionTab({ description }: DescriptionTabProps) {
  return (
    <div className="prose">
      <p className="text-gray-700 leading-relaxed break-words overflow-wrap-anywhere">{description}</p>
    </div>
  )
}