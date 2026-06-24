"use client"

export function LogoutButton() {
  return (
    <form action="/api/auth/signout" method="POST" target="_top">
      <button
        type="submit"
        className="w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
      >
        Log out
      </button>
    </form>
  )
}
