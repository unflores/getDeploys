import { Occurance } from './Occurance'

export interface Processor {
  buildOccurances(): Promise<Occurance[]>
}
