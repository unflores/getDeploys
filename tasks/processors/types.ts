export type DeployClient = {
  getDeploys: () => Promise<Bucket[]>
}

export type Bucket = {
  dayBucket: string
  monthBucket: string
  createdAt: string
}
