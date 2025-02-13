import { Secs2Item, Secs2ItemInfo } from "@/core/secs/item/type";
import { BufferReader } from "@/core/util/BufferReader";
import { Secs2ItemInfoMap } from "@/core/secs/item/secs_item_info";
import { ItemParseResolver } from "./ItemResolver";

/**
 * @description secs-II 메시지를 파싱 & 언파싱하기 위한 클래스
 */
export class Secs2MessageParser {
    private itemMap: Secs2ItemInfoMap;
    private resolver: ItemParseResolver;

    constructor(itemMap: Secs2ItemInfoMap) {
        this.itemMap = itemMap;
        this.resolver = new ItemParseResolver();
    }

    /**
     * 아이템 길이 버퍼를 파싱한다.
     * @param buffer 대상 버퍼
     * @param count 파싱해야 하는 byte 수
     * @returns 아이템의 길이
     */
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

    /**
     * secs-II 메시지의 byte length 정보를 파싱한다. 파싱한 값이 0이면 예외
     * @param data byte length 가 포함된 byte
     * @returns byte length 값
     */
    parseByteLength(data: number): number {
        const byteLengthMask = 0b000000_11;
        const byteLength = data & byteLengthMask;

        if(byteLength === 0) throw new Error("byte length must be in [1..3]");
        return byteLength;
    }

    /**
     * secs-II 메시지의 format code 정보를 파싱한다.
     * @param byte format code가 포함된 byte
     * @returns 아이템의 타입
     */
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

        const result: Partial<Secs2Item> = {
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
            resultData = this.resolver.handle(itemType, reader, length / (itemInfo.itemSize ?? 1));
        }
        result.data = resultData;

        return result as Secs2Item;
    }
}