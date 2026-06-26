const SkeletonItem = () => (
  <div className="animate-pulse bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
    <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
    <div className="h-2 bg-gray-100 rounded mb-4"></div>
    <div className="h-10 bg-gray-200 rounded w-full"></div>
  </div>
);

export default function ListCourseSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div className="animate-pulse h-8 w-48 bg-gray-200 rounded mb-2"></div>
      <div className="animate-pulse h-4 w-64 bg-gray-100 rounded mb-8"></div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="animate-pulse h-32 bg-gray-100 rounded-xl"
          ></div>
        ))}
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-6 w-20 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="h-10 w-64 bg-gray-200 rounded-lg"></div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <SkeletonItem />
        <SkeletonItem />
      </div>
    </div>
  );
}
