type Data = {
  [k: string]: number
} | (string | number)[][]

export type Writer = {
  write: (params: { subject: string, data: Data }) => void
}

export type DeployClient = {
  getDeploys: () => Promise<Bucket[]>
}

export type Bucket = {
  dayBucket: string
  monthBucket: string
  createdAt: string
}
