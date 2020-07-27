import fetch from "node-fetch"
import * as endpoints from "./endpoints"
import { State } from "./state"

export async function pullAnimation(id: number): Promise<Buffer> {
  return (
    await fetch(endpoints.asset(id)).catch(() => {
      throw new Error(`Cannot pull animation ${id}`)
    })
  ).blob()
}

export async function publishAnimation(
  state: State,
  title: string,
  description: string,
  data: Buffer,
  groupId?: number
): Promise<string> {
  const response = await fetch(endpoints.publish(title, description, groupId), {
    body: data,
    method: "POST",
    headers: {
      ...state.headers,
      "User-Agent": "RobloxStudio/WinInet",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
    },
  }).catch((e) => {
    throw new Error(`Publish of animation "${title}" failed: ${e.toString()}`)
  })

  if (!response.ok) {
    return Promise.reject(`${title}: ${response.statusText}`)
  }

  return response.text()
}
