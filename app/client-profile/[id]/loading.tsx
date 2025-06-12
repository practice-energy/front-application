export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-8"></div>
          <div className="bg-card rounded-lg p-6">
            <div className="flex items-start space-x-6 mb-6">
              <div className="w-24 h-24 bg-muted rounded-full"></div>
              <div className="flex-1">
                <div className="h-6 bg-muted rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/4 mb-4"></div>
                <div className="h-10 bg-muted rounded w-1/2"></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
