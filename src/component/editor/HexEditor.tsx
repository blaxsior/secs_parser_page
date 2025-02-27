import { useRef, useState } from "react";
import clsx from 'clsx';
import { saturate } from "@/core/util/math";
import { CopyIcon } from 'lucide-react';
import { copyToClipboard } from "@/core/util/clipboard";

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
  const inputRef = useRef<HTMLInputElement>(null);

  const inputStrRef = useRef<string>("");
  const [displayInput, setDisplayInput] = useState<string>("");

  const onCopy = async () => {
    const data = divRef.current?.textContent?.replace('+', '');
    if (!data) return;

    await copyToClipboard(data);
  };

  const onClick = () => {
    inputRef.current?.focus();
  }

  const onBlur = () => {
    inputRef.current?.blur();
    inputStrRef.current = "";
    setDisplayInput(inputStrRef.current);
  }

  const isWriting = () => inputStrRef.current.length;

  const focusElement = (idx: number, addidx = 0) => {
    // 0 = 첫번째 엘리먼트 / bytes.length + 1 = 엘리먼트 추가 시
    const targetIdx = saturate(idx, 0, bytes.length + addidx);

    if (targetIdx === selectedIdx) return;
    if (isWriting()) updateItem(selectedIdx);
    focusItemHandler(targetIdx);
  }


  const updateItem = (idx: number) => {
    let number = parseFunc(inputStrRef.current);
    if (!isNaN(number)) updateItemHandler(idx, number);

    inputStrRef.current = "";
    setDisplayInput(inputStrRef.current);
  }

  const deleteItem = (idx: number) => {
    if (idx === bytes.length) idx -= 1;
    deleteItemHandler(idx);
  }

  const handleInput = (key: string) => {
    if (key.length > 1 || !validator.test(key)) return;

    inputStrRef.current += key;
    setDisplayInput(inputStrRef.current);

    if (inputStrRef.current.length < charPerItem) return;

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
        const addIdx = isWriting() ? 1 : 0;
        focusElement(selectedIdx + 1, addIdx);
        break;
      case 'ArrowUp':
        focusElement(selectedIdx - itemPerLine);
        break;
      case 'ArrowDown':
        focusElement(selectedIdx + itemPerLine);
        break;
      case 'Backspace':
        if (isWriting()) {
          inputStrRef.current = inputStrRef.current.slice(0, inputStrRef.current.length - 1);
          setDisplayInput(inputStrRef.current);
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
    <>
      <div className="space-y-2">
        <div className="flex flex-row justify-end">
          <button
            className="p-1 border rounded-md border-gray-300 active:border-gray-400"
            onClick={onCopy}
            aria-label='copy data'
            title="copy data"
          >
            <CopyIcon color="gray" width={20} height={20} />
          </button>
        </div>
        <hr />
        <div
          tabIndex={0}
          ref={divRef}
          onFocus={onClick}
          onBlur={onBlur}
          onClick={onClick}
          className={clsx('grid font-mono justify-items-center items-stretch gap-1 focus:border', className)}
          // onKeyDown={keyHandler}
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
            >
              {selectedIdx === idx && isWriting() ? (
                displayInput
              ) : (
                displayFunc(it)
              )}
            </div>
          ))}
          <div
            aria-label={`${props["aria-label"] ?? ""}_item-add`}
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
        <input className="w-0 h-0 outline-0 opacity-0"
      ref={inputRef}
      value={""}
      onKeyDown={keyHandler}
      onChange={(e) => { e.preventDefault(); }}
      />
      </div>
      
    </>
  )
};

export default HexEditor;
