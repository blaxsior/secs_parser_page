import HexEditor from "@/component/editor/HexEditor";
import Secs2ItemEditor from "@/component/secs/Secs2ItemEditor";
import { Secs2MessageParser } from "@/core/secs/converter/parser/parser";
import { secsInfoMap } from "@/core/secs/item/secs_item_info";
import { SecsItemToSMLSerializer } from "@/core/secs/sml/serializer";
import { BufferReader } from "@/core/util/BufferReader";
import { binaryStrToNum, hexStrToNum, numToBinaryStr, numToHexStr } from "@/core/util/convert";
import { Button } from "@mui/material";
import { useMemo, useState } from "react";

function MainPage() {
    const [bytes, setBytes] = useState<number[]>([]);
    const [selectedIdx, setSelectedIdx] = useState(0);
    const [result, setResult] = useState<string>("");

    const parser = useMemo(() => new Secs2MessageParser(secsInfoMap), []);
    const smlSerializer = useMemo(() => new SecsItemToSMLSerializer(), []);

    const clear = () => {
        setBytes([]);
        setResult("");
    }

    const focusItem = (idx: number) => {
        setSelectedIdx(idx);
    };

    const parse = () => {
        try {
            const buffer = new ArrayBuffer(bytes.length);
            const uiarr = new Uint8Array(buffer);
            uiarr.set(bytes);

            const reader = new BufferReader(buffer);

            const item = parser.parse(reader);
            const result = smlSerializer.serialize(item);
            setResult(result);
        } catch {
            setResult("error!");
        }
    }

    const updateItem = (idx: number, value: number) => {
        console.log(idx, bytes.length);
        const item = [...bytes];
        item[idx] = value;
        setBytes(item);
    }

    const deleteItem = (idx: number) => {
        setBytes(bytes.filter((_, itemIdx) => itemIdx !== idx));
    }

    const regex1 = /[A-Fa-f0-9]/;
    const regex2 = /[0-1]/;

    return (
        <div className="bg-white">
            <nav className="p-2 !space-x-2">
                <Button variant="outlined" onClick={parse}>parse</Button>
                <Button variant='outlined' color="warning" onClick={clear}>clear</Button>
            </nav>
            <div className="flex flex-row space-x-8 p-2">
                {/* 에디터 쪽 */}
                <div className="space-y-4">
                    <h1 className="text-xl">Editor</h1>
                    <div className="flex flex-row border border-gray-400 w-fit">
                        <div className="m-1 space-y-2">
                            <h1>Binary</h1>
                            <hr />
                            <HexEditor
                                aria-label="binary-editor"
                                itemPerLine={2}
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
                        <div className="border-l border-gray-400"></div>
                        <div className="m-1 space-y-2">
                            <div>Hex</div>
                            <hr />
                            <HexEditor
                                aria-label="hex-editor"
                                itemPerLine={2}
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
                        </div>
                    </div>
                </div>
                {/* 결과창 쪽 */}
                <div className="space-y-4" title="result panel">
                    <h1 className="text-xl">Result</h1>
                    <pre
                        aria-label="result panel"
                        className="border border-gray-400 min-h-60 min-w-60">
                        {result}
                    </pre>
                </div>
            </div>
        </div>
    )
}
export default MainPage