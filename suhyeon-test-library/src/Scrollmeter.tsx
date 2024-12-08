import { useRef } from 'react'
import ScrollmeterBar from './ScrollmeterBar'

interface ScrollmeterProps {
    children: React.ReactNode
}

const Scrollmeter = ({ children }: ScrollmeterProps) => {
    const containerRef = useRef<HTMLDivElement>(null)

    return (
        <div style={{ position: 'relative' }}>
            <ScrollmeterBar containerRef={containerRef} />
            <div ref={containerRef}>{children}</div>
        </div>
    )
}

export default Scrollmeter
