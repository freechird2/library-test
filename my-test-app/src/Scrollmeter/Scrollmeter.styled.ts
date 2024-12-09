import styled, { css } from 'styled-components'

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
    background-color: rgba(74, 144, 226, 0.9);
    height: 100%;
    transition: width 0.3s ease-out;
`

const ScrollmeterTooltip = styled.div<{ $direction: 'left' | 'right' | 'center' }>`
    display: none;
    position: absolute;
    top: 20px;
    max-width: 150px;
    padding: 8px 12px;
    background-color: #333;
    color: white;

    > p {
        width: 100%;
        margin: 0;
        padding: 0;
        font-size: 14px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    &:after {
        content: '';
        position: absolute;
        top: -6px;
        border-style: solid;

        border-color: transparent transparent #333;
    }

    ${({ $direction }) =>
        $direction === 'left' &&
        css`
            left: 1px;
            border-radius: 0 6px 6px 6px;

            &:after {
                left: 0px;
                border-width: 0 6px 6px 1px;
            }
        `}

    ${({ $direction }) =>
        $direction === 'center' &&
        css`
            left: 50%;
            transform: translateX(-50%);
            border-radius: 6px;

            &:after {
                left: 50%;
                transform: translateX(-50%);
                border-width: 0 6px 6px 6px;
            }
        `}

    ${({ $direction }) =>
        $direction === 'right' &&
        css`
            right: 1px;
            border-radius: 6px 0 6px 6px;

            &:after {
                right: 0px;
                border-width: 0 1px 6px 6px;
            }
        `}
`

const ScrollmeterTimeline = styled.div<{ $relativePosition: number; $highestZIndex: number; $width: number }>`
    position: fixed;
    top: 0;
    left: ${({ $relativePosition }) => ($relativePosition > 99 ? 'calc(100% - 24px)' : `${$relativePosition}%`)};
    height: 10px;
    width: ${({ $width }) => $width}px;
    background-color: #2c3e50;
    cursor: pointer;
    z-index: ${({ $highestZIndex }) => $highestZIndex};

    &:hover {
        ${ScrollmeterTooltip} {
            display: block;
        }
    }
`

export const UI = {
    ScrollmeterWrapper,
    ScrollmeterBar,
    ScrollmeterTimeline,
    ScrollmeterTooltip,
}
