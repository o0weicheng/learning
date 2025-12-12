import { Link } from '@tanstack/react-router'

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-10 text-center">
      <h2 className="text-3xl font-bold mb-4">404</h2>
      <p className="text-gray-500 mb-6">这里什么都没有 🍃</p>
      <Link
        to="/"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        回到首页
      </Link>
    </div>
  )
}
