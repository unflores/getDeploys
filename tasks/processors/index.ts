type Data = {
  [k: string]: number
}

export type Writer = {
  write: (params: { subject: string, data: Data }) => void
}
