import { useEffect, useRef } from 'react'

export const useRenderCount = (componentName: string) => {
    const renderCount = useRef(0)

    useEffect(() => {
        renderCount.current += 1
        console.log(`${componentName} 렌더링 횟수:`, renderCount.current)
    })
}
