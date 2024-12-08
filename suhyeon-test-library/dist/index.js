'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var styled = require('styled-components');

const ScrollmeterWrapper = styled.div.attrs(({ $top }) => ({
    style: {
        top: `${$top || 0}px`,
    },
})) `
    position: fixed;
    left: 0;
    width: 100%;
    height: 10px;
    background-color: transparent;
    z-index: ${({ $zIndex }) => $zIndex || 0};
`;
const ScrollmeterBar$1 = styled.div.attrs(({ $width }) => ({
    style: {
        width: `${$width || 0}%`,
    },
})) `
    background-color: yellow;
    height: 100%;
    transition: width 0.3s ease-out;
`;
const UI = {
    ScrollmeterWrapper,
    ScrollmeterBar: ScrollmeterBar$1,
};

const ScrollmeterBar = ({ containerRef }) => {
    const [containerTop, setContainerTop] = react.useState(0);
    const [containerHeight, setContainerHeight] = react.useState(0);
    const [barWidth, setBarWidth] = react.useState(0);
    const [zIndex, setZIndex] = react.useState(0);
    const findHighestZIndex = react.useCallback((element) => {
        let highest = 0;
        // 현재 요소의 z-index 확인
        const zIndex = window.getComputedStyle(element).zIndex;
        if (zIndex !== 'auto') {
            highest = Math.max(highest, parseInt(zIndex));
        }
        // 모든 자식 요소들을 순회
        Array.from(element.children).forEach((child) => {
            highest = Math.max(highest, findHighestZIndex(child));
        });
        return highest + 1;
    }, [containerRef]);
    react.useEffect(() => {
        if (!containerHeight)
            return;
        const updateBarWidth = () => {
            if (!containerRef.current)
                return;
            const marginTop = parseInt(window.getComputedStyle(containerRef.current).marginTop);
            const marginBottom = parseInt(window.getComputedStyle(containerRef.current).marginBottom);
            const elementTop = window.scrollY + containerRef.current.getBoundingClientRect().top;
            const totalHeight = containerRef.current.clientHeight + marginTop + marginBottom - document.documentElement.clientHeight;
            const currentScroll = window.scrollY - elementTop;
            const scrollPercentage = (currentScroll / totalHeight) * 100;
            setContainerTop(containerRef.current.getBoundingClientRect().top);
            setBarWidth(Math.min(100, Math.max(0, scrollPercentage)));
        };
        window.addEventListener('scroll', updateBarWidth);
        return () => window.removeEventListener('scroll', updateBarWidth);
    }, [containerHeight]);
    react.useEffect(() => {
        if (!containerRef.current)
            return;
        const highestZIndex = findHighestZIndex(containerRef.current);
        setZIndex(highestZIndex);
        const resizeObserver = new ResizeObserver((entries) => {
            setContainerHeight(entries[0].contentRect.height);
        });
        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
    }, [containerRef]);
    return (jsxRuntime.jsx(UI.ScrollmeterWrapper, { "$top": containerTop < 0 ? 0 : containerTop, "$zIndex": zIndex, children: jsxRuntime.jsx(UI.ScrollmeterBar, { "$width": barWidth }) }));
};

const Scrollmeter = ({ children }) => {
    const containerRef = react.useRef(null);
    return (jsxRuntime.jsxs("div", { style: { position: 'relative' }, children: [jsxRuntime.jsx(ScrollmeterBar, { containerRef: containerRef }), jsxRuntime.jsx("div", { ref: containerRef, children: children })] }));
};

module.exports = Scrollmeter;
//# sourceMappingURL=index.js.map
