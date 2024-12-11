import { Scrollmeter, ScrollmeterOptions } from './scrollmeter'

export const createScrollmeter = (options: ScrollmeterOptions) => {
    const scrollmeter = new Scrollmeter(options)
    scrollmeter.createScrollmeter()

    return scrollmeter
}
