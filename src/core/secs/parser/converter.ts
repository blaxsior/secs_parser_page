import { BufferReader } from "../../util/BufferReader";
import type { Secs2Item, Secs2ItemInfo } from "../item/secs";
import { Secs2ItemInfoMap } from "../item/secs_item_info";
import { ItemConvertResolver } from "./ItemResolver";

/**
 * @description secs-II 메시지를 파싱 & 언파싱하기 위한 클래스
 */
export class Secs2MessageParser {
    private itemMap: Secs2ItemInfoMap;
    private resolver: ItemConvertResolver;

    constructor(itemMap: Secs2ItemInfoMap) {
        this.itemMap = itemMap;
        this.resolver = new ItemConvertResolver();
    }

    parseLength(buffer: BufferReader, count: number): number {
        if (count < 0 || count > 3) throw new Error(`count must be in [0..3], but count is ${count}`);
        if ((buffer.offset + count) > buffer.maxOffset) throw new Error(`cannot read data at ${buffer.offset + count}, buffer length is ${buffer.maxOffset}`);

        let length = 0;

        for (let i = 0; i < count; i++) {
            length <<= 8; // byte 밀기
            length |= buffer.readUInt8(); // 하위 byte 작성
        }

        return length;
    }

    parseByteLength(data: number): number {
        const byteLengthMask = 0b000000_11;
        return data & byteLengthMask;
    }

    parseType(byte: number): Secs2ItemInfo {
        // 상위 6bit
        const formatCodeMask = 0b111111_00;
        const formatCode = (formatCodeMask & byte) >> 2;

        return this.itemMap.fromFormatCode(formatCode);
    }

    parse(reader: BufferReader): Secs2Item {

        // head 파싱
        const format_and_byte_length = reader.readUInt8();

        const itemInfo = this.parseType(format_and_byte_length); // format code
        const byteLength = this.parseByteLength(format_and_byte_length); // byte length

        const length = this.parseLength(reader, byteLength); // item length


        // 아이템 타입에 따라 파싱하는 단계...
        const itemType = itemInfo.sml;
        const result: Secs2Item = {
            info: itemInfo,
        };

        let resultData: Secs2Item['data'];

        if (itemType === 'L') {
            const data: Secs2Item[] = [];
            for (let i = 0; i < length; i++) {
                const item = this.parse(reader);
                data.push(item);
            }
            resultData = data;
        } else {
            resultData = this.resolver.handle(itemType, reader, length / (itemInfo.itemByteSize ?? 1));
        }
        result.data = resultData;

        return result;
    }
}