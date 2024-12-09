import Scrollmeter from './Scrollmeter/Scrollmeter'

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

    return (
        <div>
            <Scrollmeter>
                <div style={{ backgroundColor: 'blue', height: '300px' }}></div>
                <h1 style={{ margin: 0, backgroundColor: 'red' }}>
                    라이브러리 테스트라이브러리 테스트라이브러리 테스트라이브러리 테스트라이브러리 테스트
                </h1>
                <div style={{ marginTop: '100px', height: '1000px', zIndex: 100 }}>
                    <h1>안녕하세요</h1>
                    <button style={{ position: 'relative', zIndex: 400 }}>버튼</button>
                </div>
                <div style={{ marginTop: '100px', height: '1000px' }}>
                    <h1>안녕하세요</h1>
                    <button>버튼</button>
                </div>
                <div style={{ marginTop: '100px', width: '100dvw' }}>
                    <h1>안녕하세요</h1>
                    <button>버튼</button>
                </div>
                <div style={{ backgroundColor: 'blue', height: '400px' }}></div>
            </Scrollmeter>
        </div>
    )
}

export default App
