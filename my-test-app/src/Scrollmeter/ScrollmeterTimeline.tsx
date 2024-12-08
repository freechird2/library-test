interface ScrollmeterTimelineProps {
    containerHeight: number
    h1Refs: HTMLHeadingElement[]
}

const ScrollmeterTimeline = ({ containerHeight, h1Refs }: ScrollmeterTimelineProps) => {
    return (
        <>
            {h1Refs.map((h1, idx) => {
                const h1Top = h1.offsetTop
                const relativePosition = (h1Top / (containerHeight - document.documentElement.clientHeight)) * 100
                console.log(h1Top, relativePosition, document.documentElement.clientHeight)

                return (
                    <div
                        key={`timeline-${idx}`}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: `${relativePosition}%`,
                            height: '10px',
                            width: '3px',
                            backgroundColor: 'red',
                        }}></div>
                )
            })}
        </>
    )
}

export default ScrollmeterTimeline
