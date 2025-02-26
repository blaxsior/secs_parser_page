import HexEditor from "@/component/editor/HexEditor";
import { useByteEditor } from "@/component/editor/hooks/useEditor";
import { binRegex, hexRegex } from "@/component/editor/util";
import { Secs2MessageParser } from "@/core/secs/converter/parser/parser";
import { secsInfoMap } from "@/core/secs/item/secs_item_info";
import { SecsItemToSMLSerializer } from "@/core/secs/sml/serializer";
import { BufferReader } from "@/core/util/BufferReader";
import { binaryStrToNum, hexStrToNum, numToBinaryStr, numToHexStr } from "@/core/util/convert";
import { Button } from "@mui/material";
import { useState } from "react";

const parser = new Secs2MessageParser(secsInfoMap);
const smlSerializer = new SecsItemToSMLSerializer();

function MainPage() {
    const { bytes, selectedIdx, clear: clearByte, deleteItem, focusItem, updateItem } = useByteEditor();
    const [result, setResult] = useState<string>("");

    const clear = () => {
        clearByte();
        setResult("");
    }

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

    return (
        <div className="space-y-4">
            <nav className="space-x-2!" aria-description="action buttons">
                <Button variant="outlined" onClick={parse}>parse</Button>
                <Button variant='outlined' color="warning" onClick={clear}>clear</Button>
            </nav>
            <h1 className="text-3xl">Byte Msg to Item</h1>
            <div className="flex flex-row space-x-8">
                {/* 에디터 쪽 */}
                <div className="space-y-4">
                    <h2 className="text-xl">Editor</h2>
                    <div className="flex flex-row border border-gray-400 w-fit">
                        <div className="m-1 space-y-2">
                            <h1>Binary</h1>
                            <hr />
                            <HexEditor
                                aria-label="binary-editor"
                                itemPerLine={2}
                                bytes={bytes}
                                charPerItem={8}
                                validator={binRegex}
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
                                validator={hexRegex}
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
                    <h2 className="text-xl">Result</h2>
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