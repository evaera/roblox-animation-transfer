import * as BetterQueue from 'better-queue'
import chalk from 'chalk'

export default class Queue<T = any, K = any> extends BetterQueue<T, K> {
  private _size = 0

  constructor (taskRunner: (data: T) => Promise<K>, options?: Partial<BetterQueue.QueueOptions<T, K>>) {
    super((data: T, cb: (err: Error | null, result?: K) => void) => {
      taskRunner(data)
      .then((result) => {
        this._size--
        return cb(null, result)
      })
      .catch((err: Error) => {
        this._size--
        console.error(chalk.red(err.toString()))
        return cb(err)
      })
    }, options)

    this.on('task_queued', () => this._size++)
  }

  public get size () {
    return this._size
  }
}
