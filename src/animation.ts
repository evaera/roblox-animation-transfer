import * as endpoints from './endpoints'
import axios from 'axios'
import { State } from './state'

export async function pullAnimation (id: number): Promise<string> {
  return (await axios.get(endpoints.asset(id)).catch(() => {
    throw new Error(`Cannot pull animation ${id}`)
  })).data
}

export async function publishAnimation (state: State, title: string, description: string, data: string, groupId?: number): Promise<string> {
  return (await axios.post(
    endpoints.publish(title, description, groupId),
    data,
    {
      headers: {
        ...state.headers,
        'User-Agent': 'RobloxStudio/WinInet',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Content-Type': 'application/octet-stream' // important on big animations
      },
      responseType: 'text'
    }).catch((e) => {
      throw new Error(`Publish of animation "${title}" failed: ${e.toString()}`)
    })
  ).data
}
