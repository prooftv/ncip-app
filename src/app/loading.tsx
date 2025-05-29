export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-primary to-secondary">
      <div className="text-white text-center">
        <div className="w-16 h-16 border-t-4 border-white border-solid rounded-full animate-spin mx-auto"></div>
        <p className="mt-4">Loading NCIP App...</p>
      </div>
    </div>
  )
}
