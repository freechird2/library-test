import { useCallback, useEffect, useRef, useState } from 'react'
import ScrollmeterBar from './ScrollmeterBar'
import ScrollmeterTimeline from './ScrollmeterTimeline'

interface ScrollmeterProps {
    children: React.ReactNode
}

const Scrollmeter = ({ children }: ScrollmeterProps) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [h1Refs, setH1Refs] = useState<HTMLHeadingElement[]>([])
    const [highestZIndex, setHighestZIndex] = useState<number>(0)

    const findH1Elements = useCallback((element: HTMLElement) => {
        setH1Refs([])
        const searchH1 = (el: HTMLElement) => {
            if (el.tagName.toLowerCase() === 'h1') {
                setH1Refs((prev) => [...prev, el as HTMLHeadingElement])
            }
            Array.from(el.children).forEach((child) => {
                searchH1(child as HTMLElement)
            })
        }
        searchH1(element)
    }, [])

    const findHighestZIndex = useCallback((element: HTMLElement): number => {
        let highest = 0

        const zIndex = window.getComputedStyle(element).zIndex
        if (zIndex !== 'auto') {
            highest = Math.max(highest, parseInt(zIndex))
        }

        Array.from(element.children).forEach((child) => {
            highest = Math.max(highest, findHighestZIndex(child as HTMLElement))
        })

        return highest + 1
    }, [])

    useEffect(() => {
        if (!containerRef.current) return

        findH1Elements(containerRef.current)
        setHighestZIndex(findHighestZIndex(containerRef.current))
    }, [containerRef])

    return (
        <div style={{ position: 'relative' }}>
            <ScrollmeterBar
                containerRef={containerRef}
                highestZIndex={highestZIndex}
            />
            {h1Refs.length > 0 && (
                <ScrollmeterTimeline
                    h1Refs={h1Refs}
                    containerHeight={containerRef.current?.clientHeight || 0}
                    highestZIndex={highestZIndex}
                />
            )}
            <div ref={containerRef}>{children}</div>
        </div>
    )
}

export default Scrollmeter
