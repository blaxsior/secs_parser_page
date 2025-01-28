import type { Secs2Item, Secs2ItemInfo } from "./item/secs";
import { Secs2ItemInfoMap } from "./item/secs_item_info";

/**
 * @description secs-II 메시지를 파싱 & 언파싱하기 위한 클래스
 */
export class Secs2MessageParser {
    parseLength(buffer: Uint8Array, idx: number, count: number): number {
        if(count < 0 || count > 3) throw new Error(`count must be in [0..3], but count is ${count}`);
        if((idx + count) > buffer.length) throw new Error(`cannot read data at ${idx + count}, buffer length is ${buffer.length}`);

        let length = 0;

        for(let i = idx; i < idx + count; i++) {
            length <<= 8; // byte 밀기
            length |= buffer[i]; // 하위 byte 작성
        }

        return length;
    }
    parseByteLength(data: number): number {
        const byteLengthMask = 0b000000_11;
        return data & byteLengthMask;
    }
    private itemMap: Secs2ItemInfoMap;

    constructor(itemMap: Secs2ItemInfoMap) {
        this.itemMap = itemMap;
    }

    parseType(byte: number): Secs2ItemInfo {
        // 상위 6bit
        const formatCodeMask = 0b111111_00;
        const formatCode = formatCodeMask & byte;

        return this.itemMap.fromFormatCode(formatCode);
    }

    parse(data: Int8Array): Secs2Item {
        throw new Error('Method not implemented.');
    }
}