import { useCallback, useRef, useState } from "react";
import clsx from 'clsx';
import { useFocus } from "./hooks/useFocus";
import { saturate } from "@/core/util/math";

type HexEditorProps = {
  bytes: number[],
  updateItemHandler: (idx: number, value: number) => void;
  deleteItemHandler: (idx: number) => void;
  focusItemHandler: (idx: number) => void;
  displayFunc: (num: number) => string;
  parseFunc: (str: string) => number;
  charPerItem: number;
  validator: RegExp;
  selectedIdx: number;
  className?: string;
  itemPerLine?: number;
} & React.HTMLAttributes<HTMLDivElement>;

function HexEditor({ bytes, updateItemHandler, deleteItemHandler, focusItemHandler, displayFunc, parseFunc, charPerItem, validator, selectedIdx, className, itemPerLine = 8, ...props }: HexEditorProps) {
  const divRef = useRef<HTMLDivElement>(null);

  const inputRef = useRef<string>("");
  const [displayInput, setDisplayInput] = useState<string>("");

  const { blur, click, focus, isFocused } = useFocus(divRef, {
    onBlur: () => {
      if (!isFocused) {
        inputRef.current = "";
        setDisplayInput(inputRef.current);
      }
    }
  });
  const isWriting = useCallback(() => inputRef.current.length, [inputRef]);

  const focusElement = (idx: number, addidx = 0) => {
    // 0 = 첫번째 엘리먼트 / bytes.length + 1 = 엘리먼트 추가 시
    const targetIdx = saturate(idx, 0, bytes.length + addidx);

    if (targetIdx === selectedIdx) return;
    if (isWriting()) updateItem(selectedIdx);
    focusItemHandler(targetIdx);
  }


  const updateItem = (idx: number) => {
    let number = parseFunc(inputRef.current);
    if (!isNaN(number)) updateItemHandler(idx, number);

    inputRef.current = "";
    setDisplayInput(inputRef.current);
  }

  const deleteItem = (idx: number) => {
    if (idx === bytes.length) idx -= 1;
    deleteItemHandler(idx);
  }

  const handleInput = (key: string) => {
    if (key.length > 1 || !validator.test(key)) return;

    inputRef.current += key;
    setDisplayInput(inputRef.current);

    if (inputRef.current.length < charPerItem) return;

    updateItem(selectedIdx);
    focusElement(selectedIdx + 1, 1);
  };

  const keyHandler = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const key = e.key;

    switch (key) {
      case 'ArrowLeft':
        focusElement(selectedIdx - 1);
        break;
      case 'ArrowRight':
        focusElement(selectedIdx + 1, 1);
        break;
      case 'ArrowUp':
        focusElement(selectedIdx - itemPerLine);
        break;
      case 'ArrowDown':
        focusElement(selectedIdx + itemPerLine);
        break;
      case 'Backspace':
        if (isWriting()) {
          inputRef.current = inputRef.current.slice(0, inputRef.current.length - 1);
          setDisplayInput(inputRef.current);
        } else {
          deleteItem(selectedIdx);
          focusElement(selectedIdx - 1);
        }
        break;
      default:
        handleInput(key);
        break;
    }
  }

  return (
    <div
      tabIndex={0}
      ref={divRef}
      onFocus={focus}
      onBlur={blur}
      onClick={click}
      className={clsx('grid font-mono justify-items-center items-stretch gap-1', className)}
      onKeyDown={keyHandler}
      style={{
        gridTemplateColumns: `repeat(${itemPerLine}, 1fr)`
      }}
      {...props}
    >
      {bytes.map((it, idx) => (
        <div
          aria-label={`${props["aria-label"]??""}_item-${idx}`}
          key={idx}
          onClick={() => focusElement(idx)}
          className={clsx(`p-1 text-center`,
            selectedIdx === idx && "bg-yellow-300")}
          style={{ width: `${charPerItem}rem` }}
        >
          {selectedIdx === idx && isWriting() ? (
            displayInput
          ) : (
            displayFunc(it)
          )}
        </div>
      ))}
      <div 
      aria-label={`${props["aria-label"]??""}_item-add`}
      onClick={() => focusElement(bytes.length)}
        className={clsx(`p-1 text-center border border-gray-400`,
          selectedIdx === bytes.length && "bg-yellow-300")}
        style={{ width: `${charPerItem}rem` }}
      >
        {selectedIdx === bytes.length && isWriting() ? (
          displayInput
        ) : (
          "+"
        )}</div>
    </div>
  )
};

export default HexEditor;
