import { useEffect, useState } from 'react'
import { UI } from './Scrollmeter.styled'

interface ScrollmeterBarProps {
    containerRef: React.RefObject<HTMLDivElement>
    highestZIndex: number
}

const ScrollmeterBar = ({ containerRef, highestZIndex }: ScrollmeterBarProps) => {
    const [containerTop, setContainerTop] = useState<number>(0)
    const [containerHeight, setContainerHeight] = useState<number>(0)
    const [barWidth, setBarWidth] = useState<number>(0)

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

        const resizeObserver = new ResizeObserver((entries) => {
            setContainerHeight(entries[0].contentRect.height)
        })
        resizeObserver.observe(containerRef.current)

        return () => resizeObserver.disconnect()
    }, [containerRef])

    return (
        <UI.ScrollmeterWrapper
            $top={containerTop < 0 ? 0 : containerTop}
            $zIndex={highestZIndex}>
            <UI.ScrollmeterBar $width={barWidth} />
        </UI.ScrollmeterWrapper>
    )
}

export default ScrollmeterBar
