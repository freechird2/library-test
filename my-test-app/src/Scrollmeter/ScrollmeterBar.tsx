import { useEffect, useRef, useState } from 'react'
import { UI } from './Scrollmeter.styled'

interface ScrollmeterBarProps {
    containerRef: React.RefObject<HTMLDivElement>
    highestZIndex: number
}

const ScrollmeterBar = ({ containerRef, highestZIndex }: ScrollmeterBarProps) => {
    const [containerTop, setContainerTop] = useState<number>(0)
    const [containerHeight, setContainerHeight] = useState<number>(0)
    const [barWidth, setBarWidth] = useState<number>(0)

    const draggingRef = useRef<boolean>(false)
    const barRef = useRef<HTMLDivElement>(null)
    const barTransitionRef = useRef<string | null>(null)

    const calculatePercentage = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return

        const elementWidth = e.currentTarget.offsetWidth
        const clickX = e.nativeEvent.offsetX
        const clickPercentage = (clickX / elementWidth) * 100

        const marginTop = parseInt(window.getComputedStyle(containerRef.current).marginTop)
        const marginBottom = parseInt(window.getComputedStyle(containerRef.current).marginBottom)
        const elementTop = window.scrollY + containerRef.current.getBoundingClientRect().top
        const totalHeight = containerRef.current.clientHeight + marginTop + marginBottom - document.documentElement.clientHeight

        // 클릭한 퍼센트에 해당하는 스크롤 위치 계산
        const newScrollPosition = elementTop + totalHeight * (clickPercentage / 100)
        window.scrollTo({
            top: newScrollPosition,
        })
    }

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        draggingRef.current = true
        calculatePercentage(e)

        if (!barRef.current) return
        const computedStyle = window.getComputedStyle(barRef.current)
        barTransitionRef.current = computedStyle.transition
        barRef.current.style.transition = 'none'
    }

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!draggingRef.current) return
        calculatePercentage(e)
    }

    const handleMouseUp = () => {
        draggingRef.current = false
        if (barRef.current && barTransitionRef.current) {
            setTimeout(() => {
                if (barRef.current) {
                    barRef.current.style.transition = barTransitionRef.current || ''
                }
            }, 50)
        }
    }

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
    }, [containerRef, containerHeight])

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
            $zIndex={highestZIndex}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}>
            <UI.ScrollmeterBar
                ref={barRef}
                $width={barWidth}
            />
        </UI.ScrollmeterWrapper>
    )
}

export default ScrollmeterBar
