import { ScrollmeterOptions } from './lib'
import styles from './scrollmeter.module.scss'

export class Scrollmeter {
    #targetContainer: HTMLElement | null
    #scrollmeterContainer: HTMLDivElement | null
    #scrollmeterBar: HTMLDivElement | null
    #resizeObserver: ResizeObserver | null

    #containerHeight: number

    #barWidth: number
    #totalHeight: number
    #elementTop: number

    constructor(options: ScrollmeterOptions) {
        this.#targetContainer = document.getElementById(options.targetId) ?? null
        this.#scrollmeterContainer = null
        this.#scrollmeterBar = null
        this.#resizeObserver = null

        // 숫자 필드 초기화
        this.#containerHeight = 0
        this.#barWidth = 0
        this.#totalHeight = 0
        this.#elementTop = 0

        this.#initResizeObserver()
    }

    #initResizeObserver() {
        if (!this.#targetContainer) {
            throw new Error('targetContainer is not found')
        }

        this.#resizeObserver = new ResizeObserver((entries) => {
            if (!this.#targetContainer) return

            if (this.#containerHeight === entries[0].contentRect.height) return

            this.#containerHeight = entries[0].contentRect.height

            const marginTop = parseInt(window.getComputedStyle(this.#targetContainer).marginTop)
            const marginBottom = parseInt(window.getComputedStyle(this.#targetContainer).marginBottom)
            this.#elementTop = window.scrollY + this.#targetContainer.getBoundingClientRect().top
            this.#totalHeight = this.#targetContainer.clientHeight + marginTop + marginBottom - document.documentElement.clientHeight

            this.#updateBarWidth()
        })
    }

    #createScrollmeterContainer(): HTMLDivElement | undefined {
        try {
            if (!this.#targetContainer) throw new Error('targetContainer is not found')

            const scrollmeterContainer = document.createElement('div') as HTMLDivElement
            scrollmeterContainer.classList.add(styles.scrollmeter_container)

            const highestZIndex = this.#findHighestZIndex(this.#targetContainer)
            scrollmeterContainer.style.zIndex = highestZIndex.toString()

            const scrollmeterBar = this.#createScrollmeterBar()
            scrollmeterContainer.appendChild(scrollmeterBar)

            this.#scrollmeterContainer = scrollmeterContainer

            return scrollmeterContainer
        } catch (error) {
            console.error(error)
        }
    }

    #createScrollmeterBar(): HTMLDivElement {
        const scrollmeterBar = document.createElement('div')
        scrollmeterBar.classList.add(styles.scrollmeter_bar)

        this.#scrollmeterBar = scrollmeterBar

        return scrollmeterBar
    }

    #findHighestZIndex(element: HTMLElement): number {
        let highest = 0

        const zIndex = window.getComputedStyle(element).zIndex

        if (zIndex !== 'auto') {
            highest = Math.max(highest, parseInt(zIndex))
        }

        Array.from(element.children).forEach((child) => {
            highest = Math.max(highest, this.#findHighestZIndex(child as HTMLElement))
        })

        return highest + 1
    }

    #updateBarWidth = () => {
        if (!this.#targetContainer) return

        const currentScroll = window.scrollY - this.#elementTop
        const scrollPercentage = (currentScroll / this.#totalHeight) * 100

        this.#barWidth = Math.min(100, Math.max(0, scrollPercentage))
        console.log(this.#barWidth)
        if (this.#scrollmeterBar) {
            this.#scrollmeterBar.style.width = `${this.#barWidth}%`
        }
    }

    public createScrollmeter() {
        try {
            if (!this.#targetContainer) throw new Error('targetContainer is not found')

            const existingScrollmeter = document.querySelectorAll(`.${styles.scrollmeter_container}`)

            if (existingScrollmeter.length > 0) {
                return null
            }

            if (!this.#resizeObserver) {
                throw new Error('resizeObserver is not found')
            }

            this.#resizeObserver.observe(this.#targetContainer)

            const container = this.#createScrollmeterContainer()

            if (!container) throw new Error('scrollmetercontainer is not found')

            this.#targetContainer.appendChild(container)

            window.addEventListener('scroll', this.#updateBarWidth)
        } catch (error) {
            console.error(error)
        }
    }
}
