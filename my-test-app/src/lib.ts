import { Scrollmeter } from './scrollmeter'

export interface ScrollmeterOptions {
    targetId: string
}

export const createScrollmeter = (options: ScrollmeterOptions) => {
    const scrollmeter = new Scrollmeter(options)
    scrollmeter.createScrollmeter()

    return scrollmeter
}
