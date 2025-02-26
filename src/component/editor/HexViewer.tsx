import clsx from 'clsx';
import { saturate } from "@/core/util/math";

type HexViewerProps = {
    bytes: number[],
    focusItemHandler: (idx: number) => void;
    displayFunc: (num: number) => string;
    charPerItem: number;
    selectedIdx: number;
    className?: string;
    itemPerLine?: number;
} & React.HTMLAttributes<HTMLDivElement>;

function HexViewer({ bytes, focusItemHandler, displayFunc, charPerItem, selectedIdx, className, itemPerLine = 8, ...props }: HexViewerProps) {

    const focusElement = (idx: number) => {
        // + 가 없어서 byte끼리만 이동 가능 = length - 1
        const targetIdx = saturate(idx, 0, bytes.length - 1);

        if (targetIdx === selectedIdx) return;
        focusItemHandler(targetIdx);
    };


    const keyHandler = (e: React.KeyboardEvent<HTMLDivElement>) => {
        const key = e.key;

        switch (key) {
            case 'ArrowLeft':
                focusElement(selectedIdx - 1);
                break;
            case 'ArrowRight':
                focusElement(selectedIdx + 1);
                break;
            case 'ArrowUp':
                focusElement(selectedIdx - itemPerLine);
                break;
            case 'ArrowDown':
                focusElement(selectedIdx + itemPerLine);
                break;
        }
    }

    return (
        <div
            tabIndex={0}
            className={clsx('grid font-mono justify-items-center items-stretch gap-1', className)}
            onKeyDown={keyHandler}
            style={{
                gridTemplateColumns: `repeat(${itemPerLine}, 1fr)`
            }}
            {...props}
        >
            {bytes.map((it, idx) => (
                <div
                    aria-label={`${props["aria-label"] ?? ""}_item-${idx}`}
                    key={idx}
                    onClick={() => focusElement(idx)}
                    className={clsx(`p-1 text-center`,
                        selectedIdx === idx && "bg-yellow-300")}
                    style={{ width: `${charPerItem}rem` }}
                >{displayFunc(it)}</div>
            ))}
        </div>
    )
};

export default HexViewer;
