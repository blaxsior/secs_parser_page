import HexViewer from "@/component/editor/HexViewer";
import { useByteEditor } from "@/component/editor/hooks/useEditor";
import Secs2ItemComponent from "@/component/secs/Secs2ItemComponent";
import { Secs2CompItemConverter } from "@/core/secs/component/comp_converter";
import { Secs2MessageSerializer } from "@/core/secs/converter/serializer/serializer";
import { secsInfoMap } from "@/core/secs/item/secs_item_info";
import type { Secs2CompItem } from "@/core/secs/item/type";
import { BufferWriter } from "@/core/util/BufferWriter";
import { numToBinaryStr, numToHexStr } from "@/core/util/convert";
import { Button } from "@mui/material";
import { useState } from "react";

const converter = new Secs2CompItemConverter(secsInfoMap);
const serializer = new Secs2MessageSerializer();

function EditItemPage() {
    const [rootItem, setRootItem] = useState<Secs2CompItem>({ type: 'L', data: [] });
    const { bytes, selectedIdx, setBytes, clear: clearByte, focusItem } = useByteEditor();

    const clear = () => {
        setRootItem({ type: 'L', data: [] });
        clearByte();
    }

    const serialize = () => {
        const secsitem = converter.convert(rootItem);
        const bufferWriter = new BufferWriter();
        serializer.serialize(secsitem, bufferWriter);
        const u8array = new Uint8Array(bufferWriter.buffer);
        const bytes = Array.from(u8array);
        setBytes(bytes);
    }

    return (
        <div className="space-y-4">
            <nav className="space-x-2!" aria-description="action buttons">
                <Button variant="outlined" onClick={serialize}>serialize</Button>
                <Button variant='outlined' color="warning" onClick={clear}>clear</Button>
            </nav>
            <h1 className="text-3xl">Item To Byte Msg</h1>
            <div className="flex flex-row gap-4">
                <div className="space-y-4">
                    <h2 className="text-xl">Editor</h2>
                    <Secs2ItemComponent
                        value={rootItem}
                        onChange={(newValue) => setRootItem(newValue)}
                        onRemove={() => { }}
                        root
                    />
                </div>
                {/* 결과창 쪽 */}
                <div className="space-y-4" title="result panel">
                    <h1 className="text-xl">Result</h1>
                    <div className="flex flex-row border border-gray-400 w-fit">
                        <div className="m-1 space-y-2">
                            <h1>Binary</h1>
                            <hr />
                            <HexViewer
                                aria-label="binary-viewer"
                                itemPerLine={2}
                                bytes={bytes}
                                charPerItem={8}
                                displayFunc={numToBinaryStr}
                                focusItemHandler={focusItem}
                                selectedIdx={selectedIdx}
                            />
                        </div>
                        <div className="border-l border-gray-400"></div>
                        <div className="m-1 space-y-2">
                            <div>Hex</div>
                            <hr />
                            <HexViewer
                                aria-label="hex-viewer"
                                itemPerLine={2}
                                bytes={bytes}
                                charPerItem={2}
                                displayFunc={numToHexStr}
                                focusItemHandler={focusItem}
                                selectedIdx={selectedIdx}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditItemPage;