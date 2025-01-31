import { BufferReader } from "../util/BufferReader";
import type { Secs2Item, Secs2ItemInfo } from "./item/secs";
import { Secs2ItemInfoMap } from "./item/secs_item_info";

/**
 * @description secs-II 메시지를 파싱 & 언파싱하기 위한 클래스
 */
export class Secs2MessageParser {
    private itemMap: Secs2ItemInfoMap;

    constructor(itemMap: Secs2ItemInfoMap) {
        this.itemMap = itemMap;
    }

    parseLength(buffer: BufferReader, count: number): number {
        if(count < 0 || count > 3) throw new Error(`count must be in [0..3], but count is ${count}`);
        if((buffer.offset + count) > buffer.maxOffset) throw new Error(`cannot read data at ${buffer.offset + count}, buffer length is ${buffer.maxOffset}`);

        let length = 0;

        for(let i = 0; i < count; i++) {
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
        const formatCode = formatCodeMask & byte;

        return this.itemMap.fromFormatCode(formatCode);
    }

    parse(data: ArrayBuffer): Secs2Item {
        const reader = new BufferReader(data);

        // head 파싱
        const format_and_byte_length = reader.readUInt8();
        
        const itemInfo = this.parseType(format_and_byte_length); // format code
        const byteLength = this.parseByteLength(format_and_byte_length); // byte length

        const length = this.parseLength(reader, byteLength); // item length


        // 아이템 타입에 따라 파싱하는 단계...
    }
}