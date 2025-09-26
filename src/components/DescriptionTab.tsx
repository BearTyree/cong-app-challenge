interface DescriptionTabProps {
  description: string
}

export default function DescriptionTab({ description }: DescriptionTabProps) {
  return (
    <div className="prose">
      <p className="text-gray-700 leading-relaxed">{description}</p>
    </div>
  )
}