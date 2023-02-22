import fetch from "node-fetch"
import * as endpoints from "./endpoints"

export interface State {
  headers: {
    Cookie: string
    "X-CSRF-TOKEN": string
  }
  userId: number
  failedUploads: Set<number>
}

export default async function getState(rawCookie: string): Promise<State> {
  const cookie = `.ROBLOSECURITY=${rawCookie};`

  const authReq = await fetch(endpoints.AUTHENTICATED, {
    headers: {
      Cookie: cookie,
    },
  })

  if (authReq.status !== 200) {
    throw new Error("Unable to log in with provided cookie")
  }

  const userId = (await authReq.json()).id

  const csrfReq = await fetch(endpoints.LOGOUT, {
    method: "POST",
    headers: {
      Cookie: cookie,
    },
  })

  const csrfToken = csrfReq.headers.get("x-csrf-token")

  if (!csrfToken) {
    throw new Error("Unable to determine CSRF token")
  }

  return {
    headers: {
      Cookie: cookie,
      "X-CSRF-TOKEN": csrfToken,
    },
    userId,
    failedUploads: new Set(),
  }
}
