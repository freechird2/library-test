import { useCallback, useEffect, useState } from 'react'
import { UI } from './Scrollmeter.styled'

interface ScrollmeterBarProps {
    containerRef: React.RefObject<HTMLDivElement>
}

const ScrollmeterBar = ({ containerRef }: ScrollmeterBarProps) => {
    const [containerTop, setContainerTop] = useState<number>(0)
    const [containerHeight, setContainerHeight] = useState<number>(0)
    const [barWidth, setBarWidth] = useState<number>(0)
    const [zIndex, setZIndex] = useState<number>(0)

    const findHighestZIndex = useCallback(
        (element: HTMLElement): number => {
            let highest = 0

            // 현재 요소의 z-index 확인
            const zIndex = window.getComputedStyle(element).zIndex
            if (zIndex !== 'auto') {
                highest = Math.max(highest, parseInt(zIndex))
            }

            // 모든 자식 요소들을 순회
            Array.from(element.children).forEach((child) => {
                highest = Math.max(highest, findHighestZIndex(child as HTMLElement))
            })

            return highest + 1
        },
        [containerRef]
    )

    useEffect(() => {
        if (!containerHeight) return

        const updateBarWidth = () => {
            if (!containerRef.current) return

            const marginTop = parseInt(window.getComputedStyle(containerRef.current).marginTop)
            const marginBottom = parseInt(window.getComputedStyle(containerRef.current).marginBottom)
            const elementTop = window.scrollY + containerRef.current.getBoundingClientRect().top
            const totalHeight = containerRef.current.clientHeight + marginTop + marginBottom - document.documentElement.clientHeight
            const currentScroll = window.scrollY - elementTop

            const scrollPercentage = (currentScroll / totalHeight) * 100

            setContainerTop(containerRef.current.getBoundingClientRect().top)
            setBarWidth(Math.min(100, Math.max(0, scrollPercentage)))
        }

        window.addEventListener('scroll', updateBarWidth)

        return () => window.removeEventListener('scroll', updateBarWidth)
    }, [containerHeight])

    useEffect(() => {
        if (!containerRef.current) return

        const highestZIndex = findHighestZIndex(containerRef.current)
        setZIndex(highestZIndex)

        const resizeObserver = new ResizeObserver((entries) => {
            setContainerHeight(entries[0].contentRect.height)
        })
        resizeObserver.observe(containerRef.current)

        return () => resizeObserver.disconnect()
    }, [containerRef])

    return (
        <UI.ScrollmeterWrapper
            $top={containerTop < 0 ? 0 : containerTop}
            $zIndex={zIndex}>
            <UI.ScrollmeterBar $width={barWidth} />
        </UI.ScrollmeterWrapper>
    )
}

export default ScrollmeterBar
