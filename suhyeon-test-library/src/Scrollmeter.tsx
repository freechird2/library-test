import { ReactNode, useEffect, useRef, useState } from 'react'
import styles from './Scrollmeter.module.scss'

interface ScrollMeterProps {
    children: ReactNode
}

const ScrollMeter = ({ children }: ScrollMeterProps) => {
    const [scrollProgress, setScrollProgress] = useState<number>(0)
    const contentRef = useRef<HTMLDivElement>(null)
    const [contentHeight, setContentHeight] = useState<number>(0)

    useEffect(() => {
        const updateScrollProgress = () => {
            if (!contentRef.current) return

            const totalHeight = contentHeight - window.innerHeight
            const currentScroll = window.scrollY
            const scrollPercentage = (currentScroll / totalHeight) * 100

            setScrollProgress(Math.min(100, Math.max(0, scrollPercentage)))
        }

        window.addEventListener('scroll', updateScrollProgress)

        return () => {
            window.removeEventListener('scroll', updateScrollProgress)
        }
    }, [contentHeight])

    useEffect(() => {
        console.log('한번만')
        // ResizeObserver를 사용하여 컨텐츠 높이 변화 감지
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                setContentHeight(entry.contentRect.height)
            }
        })

        const currentContent = contentRef.current
        if (currentContent) {
            resizeObserver.observe(currentContent)
        }

        return () => {
            if (currentContent) {
                resizeObserver.unobserve(currentContent)
            }
        }
    }, [])

    return (
        <>
            <div className={styles.scrollmeter}>
                <div
                    className={styles.scrollmeter__progress}
                    style={{ width: `${scrollProgress}%` }}
                />
            </div>
            <div ref={contentRef}>{children}</div>
        </>
    )
}

export default ScrollMeter
