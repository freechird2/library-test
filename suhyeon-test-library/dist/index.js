'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');

function styleInject(css, ref) {
  if (ref === void 0) ref = {};
  var insertAt = ref.insertAt;
  if (typeof document === 'undefined') {
    return;
  }
  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';
  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = ".Scrollmeter-module_scrollmeter__Y8vbC {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 4px;\n  background-color: #f0f0f0;\n  z-index: 1000;\n}\n.Scrollmeter-module_scrollmeter__progress__3lnD6 {\n  height: 100%;\n  background-color: #007bff;\n  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n}";
var styles = {"scrollmeter":"Scrollmeter-module_scrollmeter__Y8vbC","scrollmeter__progress":"Scrollmeter-module_scrollmeter__progress__3lnD6"};
styleInject(css_248z);

const ScrollMeter = ({ children }) => {
    const [scrollProgress, setScrollProgress] = react.useState(0);
    const contentRef = react.useRef(null);
    const [contentHeight, setContentHeight] = react.useState(0);
    react.useEffect(() => {
        const updateScrollProgress = () => {
            if (!contentRef.current)
                return;
            const totalHeight = contentHeight - window.innerHeight;
            const currentScroll = window.scrollY;
            const scrollPercentage = (currentScroll / totalHeight) * 100;
            setScrollProgress(Math.min(100, Math.max(0, scrollPercentage)));
        };
        window.addEventListener('scroll', updateScrollProgress);
        return () => {
            window.removeEventListener('scroll', updateScrollProgress);
        };
    }, [contentHeight]);
    react.useEffect(() => {
        console.log('한번만');
        // ResizeObserver를 사용하여 컨텐츠 높이 변화 감지
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                setContentHeight(entry.contentRect.height);
            }
        });
        const currentContent = contentRef.current;
        if (currentContent) {
            resizeObserver.observe(currentContent);
        }
        return () => {
            if (currentContent) {
                resizeObserver.unobserve(currentContent);
            }
        };
    }, []);
    return (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx("div", { className: styles.scrollmeter, children: jsxRuntime.jsx("div", { className: styles.scrollmeter__progress, style: { width: `${scrollProgress}%` } }) }), jsxRuntime.jsx("div", { ref: contentRef, children: children })] }));
};

module.exports = ScrollMeter;
//# sourceMappingURL=index.js.map
