import { useCallback } from 'react'
import { UI } from './Scrollmeter.styled'

interface ScrollmeterTimelineProps {
    containerHeight: number
    h1Refs: HTMLHeadingElement[]
    highestZIndex: number
    width?: number
}

const ScrollmeterTimeline = ({ containerHeight, h1Refs, highestZIndex, width = 4 }: ScrollmeterTimelineProps) => {
    const moveToElement = useCallback((element: HTMLHeadingElement) => {
        element.scrollIntoView({ behavior: 'smooth' })
    }, [])

    return (
        <>
            {h1Refs.map((h1, idx) => {
                const h1Top = h1.offsetTop
                const relativePosition = idx === 0 ? 7 : (h1Top / (containerHeight - document.documentElement.clientHeight)) * 100

                return (
                    <UI.ScrollmeterTimeline
                        key={`timeline-${idx}`}
                        $relativePosition={relativePosition}
                        $highestZIndex={highestZIndex + 1}
                        $width={width}
                        onClick={() => moveToElement(h1)}>
                        <UI.ScrollmeterTooltip $direction={relativePosition < 7.6 ? 'left' : relativePosition > 92.4 ? 'right' : 'center'}>
                            <p>{h1.textContent}</p>
                        </UI.ScrollmeterTooltip>
                    </UI.ScrollmeterTimeline>
                )
            })}
        </>
    )
}

export default ScrollmeterTimeline
