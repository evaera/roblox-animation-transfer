declare module "regedit" {
  export function list(
    path: string,
    callback: (err: Error | null, result: any) => void
  ): void
}
