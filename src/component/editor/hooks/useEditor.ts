import { useState } from "react";

export function useByteEditor() {
    const [bytes, setBytes] = useState<number[]>([]);
    const [selectedIdx, setSelectedIdx] = useState(0);

    function clear() {
        setBytes([]);
    }

    const focusItem = (idx: number) => {
        setSelectedIdx(idx);
    };

    const updateItem = (idx: number, value: number) => {
        const item = [...bytes];
        item[idx] = value;
        setBytes(item);
    }

    const deleteItem = (idx: number) => {
        setBytes(bytes.filter((_, itemIdx) => itemIdx !== idx));
    }

    return {
        bytes,
        selectedIdx,
        setBytes,
        clear,
        focusItem,
        updateItem,
        deleteItem
    };
}