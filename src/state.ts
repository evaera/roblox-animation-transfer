import axios from "axios"
import * as endpoints from "./endpoints"
import { extract } from "./util"

export interface State {
  headers: {
    Cookie: string
    "X-CSRF-TOKEN": string
  }
  userId: number
}

export default async function getState(rawCookie: string): Promise<State> {
  const cookie = `.ROBLOSECURITY=${rawCookie};`

  const req = await axios.get(endpoints.HOME, {
    headers: {
      Cookie: cookie,
    },
    maxRedirects: 0,
    validateStatus: (s) => [200, 302].indexOf(s) >= 0,
  })

  if (req.status !== 200) {
    throw new Error("Unable to log in with provided cookie")
  }

  const userId = extract(
    Number,
    req.data,
    /<meta name=user-data data-userid=(\d+)/,
    "Unable to determine current user id"
  )
  const csrfToken = extract(
    String,
    req.data,
    /<meta name=csrf-token data-token=(.+?)>/,
    "Unable to extract CSRF token"
  )

  return {
    headers: {
      Cookie: cookie,
      "X-CSRF-TOKEN": csrfToken,
    },
    userId,
  }
}
