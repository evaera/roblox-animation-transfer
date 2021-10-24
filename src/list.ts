import { State } from './state'
import * as endpoints from './endpoints'
import fetch from 'node-fetch'
import { Writable } from 'stream'

export async function getList (stream: Writable, state: State, endpoint: (cursor: string) => string) {
  let nextCursor = ""

  while (nextCursor != null) {
    const animationReq = await fetch(endpoint(nextCursor), {
      headers: state.headers
    })

    const { data: animationData, nextPageCursor } = await animationReq.json()

    if (!animationData) throw new Error('Failed to fetch animations')

    animationData?.forEach((asset: { assetId: number, name: string }) => {
      stream.write(`${asset.assetId} ${asset.name}\n`)
    })

    nextCursor = nextPageCursor
    if (!nextPageCursor) break
  }

  stream.end()
}

export async function getUserList (stream: Writable, state: State) {
  return getList(stream, state, s => endpoints.userList(state.userId, s))
}

export async function getGroupList (stream: Writable, state: State, groupId: number) {
  return getList(stream, state, s => endpoints.groupList(groupId, s))
}
