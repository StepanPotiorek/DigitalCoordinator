import { cookies } from "next/headers"

export async function fetchWithAuth(
  url: string,
  options?: RequestInit,
): Promise<Response> {
  const store = await cookies()
  const cookie = store
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ")

  return fetch(url, {
    ...options,
    headers: {
      ...options?.headers,
      Cookie: cookie,
    },
  })
}
