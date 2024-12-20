import { useEffect, useState } from 'react'
import { createScrollmeter } from './js-scrollmeter/lib'

function App() {
    // const updateScrollProgress = () => {
    //     if (!ref.current) return

    //     console.log({
    //         scrollY: window.scrollY,
    //         viewportHeight: document.documentElement.clientHeight,
    //         elementHeight: ref.current.offsetHeight,
    //         maxScroll: document.documentElement.scrollHeight - document.documentElement.clientHeight,
    //         totalHeight: ref.current.scrollHeight,
    //     })
    // }

    // useEffect(() => {
    //     if (ref.current) {
    //         const elementRect = ref.current.getBoundingClientRect()
    //         console.log(elementRect)

    //         window.addEventListener('scroll', updateScrollProgress)
    //     }
    // }, [])

    const [test, setTest] = useState(true)

    useEffect(() => {
        createScrollmeter({
            targetId: 'scrollmeter-container',
            useTimeline: true,
            useTooltip: true,
            usePreview: true,
            // barOptions: {
            //     color: 'rgba(74, 144, 226, 0.9)',
            //     background: 'transparent',
            //     height: 8,
            // },
            // timelineOptions: {
            //     color: 'green',
            //     width: 4,
            // },
            // tooltipOptions: {
            //     background: 'blue',
            //     fontColor: 'red',
            //     fontSize: 15,
            //     paddingBlock: 8,
            //     paddingInline: 2,
            //     width: 200,
            // },
        })
    }, [])

    return (
        <div>
            {/* <Scrollmeter> */}
            <div id='scrollmeter-container'>
                <div style={{ backgroundColor: 'blue', height: '300px' }}></div>
                <h1 style={{ marginBlock: '10px', backgroundColor: 'red' }}>
                    라이브러리 테스트라이브러리 테스트라이브러리 테스트라이브러리 테스트라이브러리 테스트
                </h1>
                <div style={{ display: test ? 'block' : 'none', marginTop: '150px', height: '1000px', zIndex: 100 }}>
                    <h1 style={{ marginBlock: '30px' }}>안녕하세요</h1>
                    <button style={{ position: 'relative', zIndex: 400 }}>버튼</button>
                </div>
                <div style={{ marginTop: '100px', height: '1000px' }}>
                    <h1>안녕하세요</h1>
                    <button onClick={() => setTest(!test)}>버튼</button>
                </div>
                <div style={{ marginTop: '100px' }}>
                    <h1>안녕하세요</h1>
                    <button>버튼</button>
                </div>
                {/* </Scrollmeter> */}
                <div style={{ backgroundColor: 'blue', height: '2000px' }}></div>
            </div>
        </div>
    )
}

export default App
