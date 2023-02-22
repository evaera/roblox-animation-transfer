import chalk from "chalk"
import * as split2 from "split2"
import { Readable, Writable } from "stream"
import { publishAnimation, pullAnimation } from "./animation"
import Queue from "./queue"
import { State } from "./state"

const description = (id: number) =>
  `Transferred from ID ${id} with roblox-animation-transfer`

export default function transfer(
  inStream: Readable,
  outStream: Writable,
  state: State,
  concurrent: number,
  groupId?: number
) {
  const queue = new Queue<{ id: number; title: string }>(
    async (d) =>
      outStream.write(
        await publishAnimation(
          state,
          state.failedUploads.has(d.id) ? "Keyframe Sequence" : d.title,
          description(d.id),
          await pullAnimation(d.id),
          groupId
        )
          .then((id) => `${id} ${d.title}\n`)
          .catch((e) => {
            state.failedUploads.add(d.id)

            return Promise.reject(e)
          })
      ),
    {
      concurrent: concurrent,
      maxRetries: 5,
      retryDelay: 5000,
      maxTimeout: 30000,
    }
  )

  inStream.pipe(split2()).on("data", (line) => {
    const words = line.split(" ")
    const id = Number(words.shift())
    const title = words.join(" ")

    if (Number.isNaN(id)) {
      console.error(chalk.red(`Error in input: id for "${title}" is not valid`))
    } else {
      queue.push({ id, title })
    }
  })
}
