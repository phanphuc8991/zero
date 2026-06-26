export default function DetailCourseSkeleton() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="animate-pulse h-8 w-1/3 bg-gray-200 rounded mb-6"></div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="animate-pulse aspect-video bg-gray-200 rounded-xl mb-6"></div>

          <div className="p-6 bg-white border border-gray-100 rounded-xl">
            <div className="animate-pulse h-6 w-32 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 w-full bg-gray-100 rounded"></div>
              <div className="h-4 w-5/6 bg-gray-100 rounded"></div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-4 bg-white border border-gray-100 rounded-xl">
            <div className="flex justify-between mb-2">
              <div className="h-4 w-20 bg-gray-200 rounded"></div>
              <div className="h-4 w-8 bg-gray-100 rounded"></div>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gray-200 animate-pulse"></div>
            </div>
          </div>
          <div className="p-4 bg-white border border-gray-100 rounded-xl">
            <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-4 w-4 bg-gray-200 rounded"></div>
                  <div className="h-4 w-32 bg-gray-100 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
