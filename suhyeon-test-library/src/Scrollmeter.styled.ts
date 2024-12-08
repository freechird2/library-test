import styled from 'styled-components'

const ScrollmeterWrapper = styled.div.attrs<{ $top: number; $zIndex: number }>(({ $top }) => ({
    style: {
        top: `${$top || 0}px`,
    },
}))`
    position: fixed;
    left: 0;
    width: 100%;
    height: 10px;
    background-color: transparent;
    z-index: ${({ $zIndex }) => $zIndex || 0};
`

const ScrollmeterBar = styled.div.attrs<{ $width: number }>(({ $width }) => ({
    style: {
        width: `${$width || 0}%`,
    },
}))`
    background-color: yellow;
    height: 100%;
    transition: width 0.3s ease-out;
`

export const UI = {
    ScrollmeterWrapper,
    ScrollmeterBar,
}
