import { Secs2Item } from "@/core/secs/item/type";
import { BufferWriter } from "@/core/util/BufferWriter";
import { ItemSerializeResolver } from "./ItemResolver";

/**
 * @description Secs2Item 객체를 secs-II 메시지로 변환하기 위한 클래스
 */
export class Secs2MessageSerializer {
    private resolver: ItemSerializeResolver;
    
    constructor() {
        this.resolver = new ItemSerializeResolver();
    }

    /**
     * Secs2 Item을 버퍼로 직렬화한다.
     * @param item 대상 아이템
     * @param writer 버퍼 작성 객체
     * @param BUF_LENGTH 버퍼의 길이. 아이템 길이를 미리 계산할 수 있는 경우 사용
     * @returns 직렬화 된 버퍼
     */
    serialize(item: Secs2Item, writer: BufferWriter, BUF_LENGTH: number = 256) {
        if(!writer) writer = new BufferWriter(BUF_LENGTH);

        // 1.아이템 타입과 길이 정보 획득
        const info = item.info;
        
        const itemLength = info.itemSize * (item.data?.length ?? 0);
        const lengthBytes = this.getLengthBytes(itemLength);

        const formatCode = info.formatCode;
        const byteLength = lengthBytes.length;

        const firstByte = this.getHeaderFirstByte(formatCode, byteLength);

        // write header
        writer.writeUInt8(firstByte);

        for(const lengthByte of lengthBytes) {
            writer.writeUInt8(lengthByte);
        }

        // 작성할 데이터 없으면 더 이상 X
        if(!item.data) return;

        // write body
        if(info.sml === 'L') { // 리스트는 재귀 처리
            for(const ditem of item.data) {
                this.serialize(ditem as Secs2Item, writer);
            } 
        } else { // 아니면 아이템 타입에 따라 변환
            this.resolver.handle(info.sml, writer, item.data);
        }

        return writer.buffer;
    }

    /**
     * 입력된 숫자에 대응되는 byte 배열을 반환한다.
     * @param length 아이템의 길이
     */
    getLengthBytes(length: number): number[] {
        const MIN_LENGTH = 0; // 길이는 양수여야 함
        const MAX_LENGTH = 0xFFFFFF; // 3byte로 표현 가능한 최대값
        if(length < MIN_LENGTH) throw new Error(`item length cannot be negative. value = ${length}`);
        if(length > MAX_LENGTH) throw new Error(`item length must be able to expressed in 3 bytes. value = ${length}`);

        const result = [];
        let byte1 = (length >> 16) & 0xFF;
        let byte2 = (length >> 8) & 0xFF;
        let byte3 = length & 0xFF;
        
        if (byte1 !== 0) result.push(byte1);
        if (byte2 !== 0) result.push(byte2);
        result.push(byte3);
        
        return result;
    }

    getHeaderFirstByte(formatCode: number, byteLength: number) {
        const formatCodeMask = 0b111111;
        const byteLengthMask = 0b11;

        let byte = 0;
        byte |= (formatCode & formatCodeMask) << 2;
        byte |= byteLength & byteLengthMask;

        return byte
    }
}