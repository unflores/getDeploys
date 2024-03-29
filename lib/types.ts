type Data =
  | {
      [k: string]: number
    }
  | (string | number)[][]
  | string[]

export type Writer = {
  write: (params: { subject: string; data: Data }) => void
}
