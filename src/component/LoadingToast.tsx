function LoadingToast({ title = "Đang xử lý..." }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Toast box */}
      <div className="relative bg-white rounded-xl shadow-xl px-6 py-5 flex items-center gap-3">
        {/* Spinning square */}
        <div className="w-7 h-7 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <div className="text-gray-800 font-medium">{title}</div>
      </div>
    </div>
  );
}

export default LoadingToast;
