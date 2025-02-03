import { useState } from "react"
import HexEditor from "./component/editor/HexEditor"
import { binaryStrToNum, hexStrToNum, numToBinaryStr, numToHexStr } from "./core/util/convert";

function App() {
  const [bytes, setBytes] = useState<number[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(0);

  const focusItem = (idx: number) => {
    setSelectedIdx(idx);
  };

  const updateItem = (idx: number, value: number) => {
    console.log(idx, bytes.length);
    const item = [...bytes];
    item[idx] = value;
    setBytes(item);
  }

  const deleteItem = (idx: number) => {
    setBytes(bytes.filter((_,itemIdx) => itemIdx !== idx));
  }
  const regex1 = /[A-Fa-f0-9]/;

  const regex2 = /[0-1]/;

  return (
    <div className="bg-gray-200 border">
      <HexEditor
        bytes={bytes}
        charPerItem={2}
        validator={regex1}
        displayFunc={numToHexStr}
        parseFunc={hexStrToNum}
        updateItemHandler={updateItem}
        deleteItemHandler={deleteItem}
        focusItemHandler={focusItem}
        selectedIdx={selectedIdx}
      />
       <HexEditor
        itemPerLine={1}
        bytes={bytes}
        charPerItem={8}
        validator={regex2}
        displayFunc={numToBinaryStr}
        parseFunc={binaryStrToNum}
        updateItemHandler={updateItem}
        deleteItemHandler={deleteItem}
        focusItemHandler={focusItem}
        selectedIdx={selectedIdx}
      />
    </div>
  )
}

export default App
