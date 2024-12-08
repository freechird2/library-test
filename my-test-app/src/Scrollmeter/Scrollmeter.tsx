import { useCallback, useEffect, useRef, useState } from 'react'
import ScrollmeterBar from './ScrollmeterBar'
import ScrollmeterTimeline from './ScrollmeterTimeline'

interface ScrollmeterProps {
    children: React.ReactNode
}

const Scrollmeter = ({ children }: ScrollmeterProps) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [h1Refs, setH1Refs] = useState<HTMLHeadingElement[]>([])

    const findH1Elements = useCallback(
        (element: HTMLElement) => {
            // h1Refs 배열 초기화
            setH1Refs([])

            const searchH1 = (el: HTMLElement) => {
                // 현재 요소가 h1인지 확인
                if (el.tagName.toLowerCase() === 'h1') {
                    setH1Refs((prev) => [...prev, el as HTMLHeadingElement])
                }

                // 모든 자식 요소들을 순회하며 h1 검색
                Array.from(el.children).forEach((child) => {
                    searchH1(child as HTMLElement)
                })
            }

            searchH1(element)
        },
        [containerRef]
    )

    useEffect(() => {
        if (!containerRef.current) return

        findH1Elements(containerRef.current)
    }, [containerRef])

    return (
        <div style={{ position: 'relative' }}>
            <ScrollmeterBar containerRef={containerRef} />
            {h1Refs.length > 0 && (
                <ScrollmeterTimeline
                    h1Refs={h1Refs}
                    containerHeight={containerRef.current?.clientHeight || 0}
                />
            )}
            <div ref={containerRef}>{children}</div>
        </div>
    )
}

export default Scrollmeter
