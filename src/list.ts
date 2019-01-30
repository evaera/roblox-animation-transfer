import { State } from './state'
import * as endpoints from './endpoints'
import axios from 'axios'
import * as cheerio from 'cheerio'
import { extract } from './util'
import { Writable } from 'stream'

const PER_PAGE = 50
const LINK_SELECTOR = '.name-col > a'
const HAS_NEXT_PAGE_SELECTOR = '.load-more-items'

export async function getList (stream: Writable, state: State, endpoint: (startRow: number) => string) {
  for (let pageNum = 0; ; pageNum++) {
    const page = await axios.get(endpoint(pageNum * PER_PAGE), {
      headers: state.headers,
      validateStatus: s => s === 200
    })

    const $ = cheerio.load(page.data)
    $(LINK_SELECTOR).each(function () {
      stream.write(`${extract(Number, $(this).attr('href'), /catalog\/(\d+)\//, 'Unable to extract animation ID')} ${$(this).text()}\n`)
    })

    if ($(HAS_NEXT_PAGE_SELECTOR).length === 0) break
  }

  stream.end()
}

export async function getUserList (stream: Writable, state: State) {
  return getList(stream, state, s => endpoints.userList(state.userId, s))
}

export async function getGroupList (stream: Writable, state: State, groupId: number) {
  return getList(stream, state, s => endpoints.groupList(groupId, s))
}
