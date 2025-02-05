import { beforeEach, describe, expect, it } from "vitest";
import { Secs2MessageSerializer } from "./serializer";
import { secsInfoMap } from "../../item/secs_item_info";
import { Secs2Item } from "../../item/type";
import { BufferWriter } from "@/core/util/BufferWriter";

describe("Secs Serializer test", () => {
    let serializer: Secs2MessageSerializer;

    beforeEach(() => {
        serializer = new Secs2MessageSerializer();
    });

    describe("getLengthBytes", () => {
        it("입력된 숫자에 대응되는 byte 배열을 반환한다.(1byte)", () => {
            const item_bytes_length = 4 * 10; //int32 * 10

            const expected = [40];

            const result = serializer.getLengthBytes(item_bytes_length);

            expect(result).toEqual(expected);
        });

        it("입력된 숫자에 대응되는 byte 배열을 반환한다.(2byte)", () => {
            const item_bytes_length = 256 // 0x0100

            const expected = [1, 0];

            const result = serializer.getLengthBytes(item_bytes_length);

            expect(result).toEqual(expected);
        });

        it("입력된 숫자에 대응되는 byte 배열을 반환한다.(3byte)", () => {
            const item_bytes_length = 65536 // 0x010000

            const expected = [1, 0];

            const result = serializer.getLengthBytes(item_bytes_length);

            expect(result).toEqual(expected);
        });

        it("입력된 숫자가 3byte로 표현 가능한 범위가 아닌 경우 예외가 발생한다.", () => {
            const wrong_item_bytes_length1 = -1; //음수는 불가능
            const wrong_item_bytes_length2 = 0x1000000; //0xFFFFFF + 1. 3byte 초과

            // 0 미만
            expect(() => {
                serializer.getLengthBytes(wrong_item_bytes_length1);
            }).toThrow();

            // 3byte 초과
            expect(() => {
                serializer.getLengthBytes(wrong_item_bytes_length2);
            }).toThrow();
        });
    });

    describe('serialize', () => {
        it('L 타입 데이터 직렬화', () => {
            const item: Secs2Item = {
                info: secsInfoMap.fromSML('L'),
                data: [
                    {
                        info: secsInfoMap.fromSML('B'),
                        data: [4],
                    },
                    {
                        info: secsInfoMap.fromSML('A'),
                        data: 'T1 HIGH',
                    }
                ],
            };

            const writer = new BufferWriter();

            serializer.serialize(item, writer);

            const buffer = writer.buffer;
            const view = new DataView(buffer);

            // Check the serialized values, assuming expected data is set in buffer.
            expect(view.getUint8(0)).toBe(0b00000001); // List
            expect(view.getUint8(1)).toBe(0b00000010); // 2 elements
            expect(view.getUint8(2)).toBe(0b00100001); // Binary
            expect(view.getUint8(3)).toBe(0b00000001); // 1 byte long
            expect(view.getUint8(4)).toBe(0b00000100); // alarm set, category 4
            expect(view.getUint8(5)).toBe(0b01000001); // Item, ASCII
            expect(view.getUint8(6)).toBe(0b00000111); // 7 char
            expect(view.getUint8(7)).toBe(0b01010100); // ASCII T
            expect(view.getUint8(8)).toBe(0b00110001); // ASCII 1
            expect(view.getUint8(9)).toBe(0b00100000); // ASCII space
            expect(view.getUint8(10)).toBe(0b01001000); // ASCII H
            expect(view.getUint8(11)).toBe(0b01001001); // ASCII I
            expect(view.getUint8(12)).toBe(0b01000111); // ASCII G
            expect(view.getUint8(13)).toBe(0b01001000); // ASCII H
        });

        it('Binary 타입 데이터 직렬화', () => {
            const item: Secs2Item = {
                info: secsInfoMap.fromSML('B'),
                data: [0b10101010],
            };

            const writer = new BufferWriter();

            serializer.serialize(item, writer);

            const buffer = writer.buffer;
            const view = new DataView(buffer);

            expect(view.getUint8(0)).toBe(0b00100001); // Binary type
            expect(view.getUint8(1)).toBe(0b00000001); // 1 element
            expect(view.getUint8(2)).toBe(0b10101010); // Data value
        });

        it('Boolean 타입 데이터 직렬화', () => {
            const item: Secs2Item = {
                info: secsInfoMap.fromSML('BOOLEAN'),
                data: [true, false],
            };

            const writer = new BufferWriter();

            serializer.serialize(item, writer);

            const buffer = writer.buffer;
            const view = new DataView(buffer);

            expect(view.getUint8(0)).toBe(0b00100101); // Boolean type
            expect(view.getUint8(1)).toBe(0b00000010); // 2 elements
            expect(view.getUint8(2)).toBe(0b00000001); // true
            expect(view.getUint8(3)).toBe(0b00000000); // false
        });

        it('A 타입 데이터 직렬화', () => {
            const item: Secs2Item = {
                info: secsInfoMap.fromSML('A'),
                data: 'ABC',
            };

            const writer = new BufferWriter();

            serializer.serialize(item, writer);

            const buffer = writer.buffer;
            const view = new DataView(buffer);

            expect(view.getUint8(0)).toBe(0b01000001); // ASCII type
            expect(view.getUint8(1)).toBe(0b00000011); // 3 elements
            expect(view.getUint8(2)).toBe(0b01000001); // 'A'
            expect(view.getUint8(3)).toBe(0b01000010); // 'B'
            expect(view.getUint8(4)).toBe(0b01000011); // 'C'
        });

        it('I8 타입 데이터 직렬화', () => {
            const ui64max = 0xFFFF_FFFF_FFFF_FFFFn;

            const item: Secs2Item = {
                info: secsInfoMap.fromSML('I8'),
                data: [-1n],
            };

            const writer = new BufferWriter();

            serializer.serialize(item, writer);

            const buffer = writer.buffer;
            const view = new DataView(buffer);

            expect(view.getUint8(0)).toBe(0b01100001); // I8 type
            expect(view.getUint8(1)).toBe(0b00001000); // 1 element
            expect(view.getBigUint64(2)).toBe(ui64max); // -1 as 64-bit signed integer
        });

        it('I1 타입 데이터 직렬화', () => {
            const item: Secs2Item = {
                info: secsInfoMap.fromSML('I1'),
                data: [-1],
            };

            const writer = new BufferWriter();

            serializer.serialize(item, writer);

            const buffer = writer.buffer;
            const view = new DataView(buffer);

            expect(view.getUint8(0)).toBe(0b01100101); // I1 type
            expect(view.getUint8(1)).toBe(0b00000001); // 1 element
            expect(view.getUint8(2)).toBe(255); // -1 as 1-byte signed integer
        });

        it('I2 타입 데이터 직렬화', () => {
            const item: Secs2Item = {
                info: secsInfoMap.fromSML('I2'),
                data: [10, 20, 30],
            };

            const writer = new BufferWriter();

            serializer.serialize(item, writer);

            const buffer = writer.buffer;
            const view = new DataView(buffer);

            expect(view.getUint8(0)).toBe(0b01101001); // I2 type
            expect(view.getUint8(1)).toBe(0b00000110); // 3 elements
            expect(view.getInt16(2)).toBe(10); // First value
            expect(view.getInt16(4)).toBe(20); // Second value
            expect(view.getInt16(6)).toBe(30); // Third value
        });

        it('I4 타입 데이터 직렬화', () => {
            const item: Secs2Item = {
                info: secsInfoMap.fromSML('I4'),
                data: [-1],
            };

            const writer = new BufferWriter();

            serializer.serialize(item, writer);

            const buffer = writer.buffer;
            const view = new DataView(buffer);

            expect(view.getUint8(0)).toBe(0b01110001); // I4 type
            expect(view.getUint8(1)).toBe(0b00000100); // 1 element
            expect(view.getUint32(2)).toBe(0xFFFF_FFFF); // -1 as 4-byte signed integer
        });

        it('U8 타입 데이터 직렬화', () => {
            const ui64max = 0xFFFF_FFFF_FFFF_FFFFn;

            const item: Secs2Item = {
                info: secsInfoMap.fromSML('U8'),
                data: [ui64max],
            };

            const writer = new BufferWriter();

            serializer.serialize(item, writer);

            const buffer = writer.buffer;
            const view = new DataView(buffer);

            expect(view.getUint8(0)).toBe(0b10100001); // U8 type
            expect(view.getUint8(1)).toBe(0b00001000); // 1 element
            expect(view.getBigUint64(2)).toBe(ui64max); // 64-bit unsigned integer
        });

        it('U1 타입 데이터 직렬화', () => {
            const item: Secs2Item = {
                info: secsInfoMap.fromSML('U1'),
                data: [255],
            };

            const writer = new BufferWriter();

            serializer.serialize(item, writer);

            const buffer = writer.buffer;
            const view = new DataView(buffer);

            expect(view.getUint8(0)).toBe(0b10100101); // U1 type
            expect(view.getUint8(1)).toBe(0b00000001); // 1 element
            expect(view.getUint8(2)).toBe(255); // 255 as 1-byte unsigned integer
        });

        it('U2 타입 데이터 직렬화', () => {
            const item: Secs2Item = {
                info: secsInfoMap.fromSML('U2'),
                data: [65535],
            };

            const writer = new BufferWriter();

            serializer.serialize(item, writer);

            const buffer = writer.buffer;
            const view = new DataView(buffer);

            expect(view.getUint8(0)).toBe(0b10101001); // U2 type
            expect(view.getUint8(1)).toBe(0b00000010); // 1 element
            expect(view.getUint16(2)).toBe(65535); // 65535 as 2-byte unsigned integer
        });

        it('U4 타입 데이터 직렬화', () => {
            const item: Secs2Item = {
                info: secsInfoMap.fromSML('U4'),
                data: [4294967295],
            };

            const writer = new BufferWriter();

            serializer.serialize(item, writer);

            const buffer = writer.buffer;
            const view = new DataView(buffer);

            expect(view.getUint8(0)).toBe(0b10110001); // U4 type
            expect(view.getUint8(1)).toBe(0b00000100); // 4byte
            expect(view.getUint32(2)).toBe(4294967295); // 4294967295 as 4-byte unsigned integer
        });

        it('F4 타입 데이터 직렬화', () => {
            const item: Secs2Item = {
                info: secsInfoMap.fromSML('F4'),
                data: [3.14],
            };

            const writer = new BufferWriter();

            serializer.serialize(item, writer);

            const buffer = writer.buffer;
            const view = new DataView(buffer);

            expect(view.getUint8(0)).toBe(0b10010001); // F4 type
            expect(view.getUint8(1)).toBe(0b00000100); // 1 element
            expect(view.getFloat32(2)).toBeCloseTo(3.14, 2); // 3.14 as 4-byte float
        });

        it('F8 타입 데이터 직렬화', () => {
            const item: Secs2Item = {
                info: secsInfoMap.fromSML('F8'),
                data: [0.123456789],
            };

            const writer = new BufferWriter();

            serializer.serialize(item, writer);

            const buffer = writer.buffer;
            const view = new DataView(buffer);

            expect(view.getUint8(0)).toBe(0b10000001); // F8 type
            expect(view.getUint8(1)).toBe(0b00001000); // 1 element
            expect(view.getFloat64(2)).toBeCloseTo(0.123456789, 15); // 3.141592653589793 as 8-byte float
        });
    });
});