import html2canvas from 'html2canvas'
import styles from './scrollmeter.module.scss'

interface ScrollmeterTimelineOptions {
    color?: string
    width?: number
}

interface ScrollmeterBarOptions {
    color?: string
    background?: string
    height?: number
}

export interface ScrollmeterOptions {
    targetId: string
    useTimeline?: boolean
    useTooltip?: boolean
    barOptions?: ScrollmeterBarOptions
    timelineOptions?: ScrollmeterTimelineOptions
}

export class Scrollmeter {
    #defaultOptions: ScrollmeterOptions
    #targetContainer: HTMLElement | null
    #scrollmeterContainer: HTMLDivElement | null
    #scrollmeterBar: HTMLDivElement | null
    #resizeObserver: ResizeObserver | null

    #useTimeline: boolean
    #timelineElements: HTMLElement[]

    #captureCanvas: HTMLCanvasElement | null

    #containerHeight: number
    #barWidth: number
    #totalHeight: number
    #elementTop: number
    #highestZIndex: number

    constructor(options: ScrollmeterOptions) {
        const { targetId, useTimeline = false } = options
        this.#defaultOptions = options

        this.#targetContainer = document.getElementById(targetId) ?? null
        this.#scrollmeterContainer = null
        this.#scrollmeterBar = null
        this.#resizeObserver = null

        this.#useTimeline = useTimeline
        this.#timelineElements = []

        // 숫자 필드 초기화
        this.#containerHeight = 0
        this.#barWidth = 0
        this.#totalHeight = 0
        this.#elementTop = 0
        this.#highestZIndex = 0

        this.#initResizeObserver()
    }

    #initResizeObserver() {
        if (!this.#targetContainer) {
            throw new Error('targetContainer is not found')
        }

        this.#resizeObserver = new ResizeObserver(async (entries) => {
            if (!this.#targetContainer) return

            if (this.#containerHeight === entries[0].contentRect.height) return

            this.#containerHeight = entries[0].contentRect.height

            const marginTop = parseInt(window.getComputedStyle(this.#targetContainer).marginTop)
            const marginBottom = parseInt(window.getComputedStyle(this.#targetContainer).marginBottom)
            this.#elementTop = window.scrollY + this.#targetContainer.getBoundingClientRect().top
            this.#totalHeight = this.#targetContainer.clientHeight + marginTop + marginBottom - document.documentElement.clientHeight

            this.#updateBarWidth()

            if (this.#useTimeline) {
                const timelineElements = this.#findTimelineElements(this.#targetContainer)

                if (timelineElements.length > 0) {
                    this.#timelineElements = timelineElements

                    await this.#captureContainer()
                    this.#createTimeline()
                }
            }
        })
    }

    #createScrollmeterContainer(): HTMLDivElement | undefined {
        try {
            if (!this.#targetContainer) throw new Error('targetContainer is not found')

            const scrollmeterContainer = document.createElement('div') as HTMLDivElement
            scrollmeterContainer.classList.add(styles.scrollmeter_container)

            // css custom
            if (this.#defaultOptions.barOptions) {
                const { color, background, height } = this.#defaultOptions.barOptions
                if (color) {
                    scrollmeterContainer.style.setProperty('--scrollmeter-bar-color', color)
                }
                if (background) {
                    scrollmeterContainer.style.setProperty('--scrollmeter-bar-background', background)
                }
                if (height) {
                    scrollmeterContainer.style.setProperty('--scrollmeter-bar-height', `${height}px`)
                }
            }

            const highestZIndex = this.#findHighestZIndex(this.#targetContainer)
            this.#highestZIndex = highestZIndex
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

    #createTimeline = () => {
        this.#timelineElements.map((element) => {
            const timelineElement = document.createElement('div')
            timelineElement.classList.add(styles.scrollmeter_timeline)

            const elementTop = element.offsetTop
            const relativePosition = (elementTop / (this.#containerHeight - document.documentElement.clientHeight)) * 100

            // css custom
            if (this.#defaultOptions.timelineOptions) {
                const { color, width } = this.#defaultOptions.timelineOptions

                if (color) {
                    timelineElement.style.setProperty('--scrollmeter-timeline-color', color)
                }
                if (width) {
                    timelineElement.style.setProperty('--scrollmeter-timeline-width', `${width}px`)
                }
            }

            timelineElement.style.left = `${relativePosition > 100 ? 'calc(100% - 4px)' : `${relativePosition}%`}`
            timelineElement.style.zIndex = this.#highestZIndex.toString()

            timelineElement.addEventListener('click', () => {
                element.scrollIntoView({ behavior: 'smooth' })
            })

            const dataUrl = this.#cropImageAtPercent(element.offsetTop)
            if (dataUrl) {
                const preview = this.#createPreview(dataUrl)
                timelineElement.appendChild(preview)
            }
            // if (this.#defaultOptions.useTooltip) {
            //     this.#createTimelineTooltip(
            //         timelineElement,
            //         element,
            //         relativePosition < 7.6 ? 'left' : relativePosition > 92.4 ? 'right' : 'center'
            //     )
            // }

            this.#scrollmeterContainer?.appendChild(timelineElement)
        })
    }

    #createTimelineTooltip = (timelineElement: HTMLDivElement, targetElement: HTMLElement, direction: 'left' | 'right' | 'center') => {
        if (!targetElement.textContent) return
        const timelineTooltip = document.createElement('div')
        const timelineTooltipText = document.createElement('p')

        timelineTooltip.classList.add(styles.scrollmeter_timeline_tooltip)
        timelineTooltip.classList.add(styles[`scrollmeter_timeline_tooltip_${direction}`])

        timelineTooltipText.textContent = targetElement.textContent

        timelineTooltip.appendChild(timelineTooltipText)

        timelineElement.appendChild(timelineTooltip)
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

    #findTimelineElements = (element: HTMLElement): HTMLElement[] => {
        // 기존 타임라인 요소들 제거
        const existingTimelines = this.#scrollmeterContainer?.querySelectorAll(`.${styles.scrollmeter_timeline}`)
        existingTimelines?.forEach((element) => element.remove())

        const elArray: HTMLElement[] = []

        const searchH1 = (el: HTMLElement) => {
            if (el.tagName.toLowerCase() === 'h1') {
                if (this.#isElementVisible(el)) {
                    elArray.push(el as HTMLHeadingElement)
                }
            }

            Array.from(el.children).forEach((child) => {
                searchH1(child as HTMLElement)
            })
        }

        searchH1(element)

        return elArray
    }

    #isElementVisible(element: HTMLElement): boolean {
        // 요소 자체나 부모 요소들의 style 체크
        const style = window.getComputedStyle(element)
        if (style.display === 'none') return false
        if (style.visibility === 'hidden') return false
        if (style.opacity === '0') return false

        // 부모 요소들도 순차적으로 확인
        let currentElement: HTMLElement | null = element.parentElement
        while (currentElement) {
            const parentStyle = window.getComputedStyle(currentElement)
            if (parentStyle.display === 'none') return false
            if (parentStyle.visibility === 'hidden') return false
            if (parentStyle.opacity === '0') return false
            currentElement = currentElement.parentElement
        }

        return true
    }

    #updateBarWidth = () => {
        if (!this.#targetContainer) return

        const currentScroll = window.scrollY - this.#elementTop
        const scrollPercentage = (currentScroll / this.#totalHeight) * 100

        this.#barWidth = Math.min(100, Math.max(0, scrollPercentage))

        if (this.#scrollmeterBar) {
            this.#scrollmeterBar.style.width = `${this.#barWidth}%`
        }
    }

    #captureContainer = async () => {
        if (!this.#targetContainer) return

        try {
            const canvas = await html2canvas(this.#targetContainer)

            this.#captureCanvas = canvas
        } catch (error) {
            console.error('미리보기를 생성하는 중 오류가 발생했습니다:', error)
        }
    }

    #cropImageAtPercent = (top: number, cropWidth: number = 320) => {
        if (!this.#captureCanvas) return

        const canvasWidth = this.#captureCanvas.width
        const canvasHeight = (canvasWidth * 9) / 16 // 16:9 비율 계산
        const y = Math.max(0, top - canvasHeight / 2)

        const cropHeight = (cropWidth * 9) / 16 // 16:9 비율 계산

        const tempCanvas = document.createElement('canvas')
        tempCanvas.width = cropWidth
        tempCanvas.height = cropHeight

        const ctx = tempCanvas.getContext('2d')
        if (!ctx) return null

        // 크롭된 영역 그리기
        ctx.drawImage(
            this.#captureCanvas,
            0,
            Math.max(0, Math.min(y, this.#captureCanvas.height - canvasHeight)), // y값 범위 제한
            canvasWidth,
            canvasHeight,
            0,
            0,
            cropWidth,
            cropHeight
        )

        return tempCanvas.toDataURL()
    }

    #createPreview = (dataUrl: string) => {
        const div = document.createElement('div')
        div.classList.add(styles.scrollmeter_timeline_preview)

        const img = new Image()

        // 이미지 스타일 설정
        img.style.cssText = `
            width: 100%;
            height: 100%;
            display: block;
        `

        img.src = dataUrl

        div.appendChild(img)
        return div
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
