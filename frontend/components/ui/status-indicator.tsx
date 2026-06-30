import { Badge } from "@/components/ui/badge"
import { StudentStatus } from "@/types/exam"

interface StatusIndicatorProps {
  status: StudentStatus
  type?: "badge" | "dot"
}

export function StatusIndicator({ status, type = "badge" }: StatusIndicatorProps) {
  if (type === "dot") {
    if (status === "Exempt") {
      return (
        <span className="inline-flex items-center gap-1 text-sm text-green-700">
          Exempt
        </span>
      )
    } else {
      return <span className="text-sm text-gray-600">Required</span>
    }
  }

  // Badge type (default)
  const badgeClasses = 
    status === "Exempt" ? "bg-blue-50 text-blue-700" :
    "bg-gray-50 text-gray-700"

  return (
    <Badge variant="secondary" className={badgeClasses}>
      {status}
    </Badge>
  )
}
