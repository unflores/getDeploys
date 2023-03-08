import { Factory } from 'fishery'
import { Occurance } from '../Occurances'

const occuranceFactory = Factory.define<Occurance>(({ params }) => ({
  type: params.type || 'contributer',
  bucket: params.bucket || '2010-10-10',
  occurredAt: params.occurredAt || new Date(),
  createdAt: params.createdAt || new Date()
}))

export {
  occuranceFactory
}
