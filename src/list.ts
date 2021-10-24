import { State } from './state'
import * as endpoints from './endpoints'
import axios from 'axios'
import { Writable } from 'stream'

export async function getList (stream: Writable, state: State, endpoint: (cursor: string) => string) {
  let nextCursor = ""

  while (nextCursor !== null) {
    const animationData = await axios(endpoint(nextCursor), {
      headers: state.headers,
      validateStatus: s => s === 200
    })

    animationData.data?.data.forEach((asset: { assetId: number, name: string }) => {
      stream.write(`${asset.assetId} ${asset.name}\n`)
    })

    if (!animationData.data.nextPageCursor) break
    nextCursor = animationData.data.nextPageCursor
  }

  stream.end()
}

export async function getUserList (stream: Writable, state: State) {
  return getList(stream, state, s => endpoints.userList(state.userId, s))
}

export async function getGroupList (stream: Writable, state: State, groupId: number) {
  return getList(stream, state, s => endpoints.groupList(groupId, s))
}
