// Loading component for calendar actions
export const LoadingView = () => (
    <div className="flex items-center justify-center p-4">
      <div className="animate-spin h-6 w-6 border-2 border-[#2b725e] rounded-full border-t-transparent"></div>
      <span className="ml-2 text-white">Loading...</span>
    </div>
  );