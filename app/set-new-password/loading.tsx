import { Card } from "@/components/ui/card"

export default function SetNewPasswordLoading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 sm:px-6 lg:px-8 max-w-md mx-auto py-16">
        <Card className="p-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
          </div>

          <div className="h-8 bg-gray-200 rounded mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded mb-8 animate-pulse"></div>

          <div className="space-y-6">
            <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </Card>
      </div>
    </div>
  )
}
