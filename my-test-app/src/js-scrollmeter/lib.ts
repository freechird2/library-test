import { Scrollmeter } from './scrollmeter'
import { ScrollmeterOptions } from './scrollmeter.types'

export const createScrollmeter = (options: ScrollmeterOptions) => {
  const scrollmeter = new Scrollmeter(options)
  scrollmeter.createScrollmeter()
}
