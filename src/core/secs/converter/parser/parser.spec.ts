import { beforeEach, describe, expect, it } from 'vitest';
import { Secs2Item, Secs2ItemInfo } from '@/core/secs/item/type';
import { secsInfoMap } from '@/core/secs/item/secs_item_info';
import { BufferReader } from '@/core/util/BufferReader';
import { Secs2MessageParser } from './parser';

describe('SecsParser Test', () => {
    let parser: Secs2MessageParser;

    beforeEach(() => {
        parser = new Secs2MessageParser(secsInfoMap);
    });

    describe('parseType', () => {
        it("포맷 코드를 파싱, 대응되는 타입 획득", () => {
            const data = 0b000000_01; // 길이가 1인 list
            const expected: Secs2ItemInfo<'L'> = secsInfoMap.fromSML('L');

            const result: Secs2ItemInfo = parser.parseType(data);

            expect(result).toEqual(expected);
        });

        it("매칭되지 않는 format code인 경우 error 발생", () => {
            const data = 0b111111_01; // 존재하지 않는 format

            expect(() => {
                parser.parseType(data);
            }).toThrow();
        });
    });

    describe('parseByteLength', () => {
        it("byte 길이를 파싱해 반환", () => {
            const data = 0b000000_10; // byte 길이 = 2
            const expected = 2;

            const result: number = parser.parseByteLength(data);
            expect(result).toEqual(expected);
        });

        it("length byte는 0이 될 수 없음", () => {
            //근거: actual number of bytes in the message for one item is the item length plus 2, 3, 4 bytes for the item header
            //header 길이가 최소 2라는 것은 length byte가 최소 1 byte라는 것

            const data = 0b000000_00; // byte 길이 = 0
            
            expect(() => {
                parser.parseByteLength(data);
            }).toThrow();
        })
    });

    describe('parseLength', () => {
        let reader: BufferReader;
        beforeEach(() => {
            const buffer = new ArrayBuffer(4);
            const view = new DataView(buffer);
            view.setUint32(0, 0xAB_CD_EF_00);

            reader = new BufferReader(buffer);
        });
        it('count만큼 byte를 읽어 길이 획득', () => {
            const count = 2; // 2byte 읽기

            const expected = 43981; // 0xABCD

            const result = parser.parseLength(reader, count);
            expect(result).toEqual(expected);
        });

        it('읽는 byte 개수 = count가 [1..3]을 벗어나면 예외 발생', () => {

            const wrong_count1 = 0;
            expect(() => {
                parser.parseLength(reader, wrong_count1);
            }).toThrowError('count must be in');

            reader.resetOffset();

            const wrong_count2 = 4;
            expect(() => {
                parser.parseLength(reader, wrong_count2);
            }).toThrowError('count must be in');
        });

        it('현재 버퍼 위치부터 count 개의 byte를 읽을 수 없다면 예외 발생', () => {
            reader.readInt16();
            const wrong_count1 = 3; // 3개

            expect(() => {
                parser.parseLength(reader, wrong_count1);
            }).toThrowError('cannot read');
        });
    });

    describe('parse', () => {
        it('데이터가 들어오면 타입에 맞게 파싱(L)', () => {
            const buffer = new ArrayBuffer(14);
            const view = new DataView(buffer);
            view.setUint8(0, 0b00000001); // List
            view.setUint8(1, 0b00000010); // 2 element
            view.setUint8(2, 0b00100001); // binary
            view.setUint8(3, 0b00000001); // 1 byte long
            view.setUint8(4, 0b00000100); // alarm set, category 4
            view.setUint8(5, 0b01000001); // Item, ASCII
            view.setUint8(6, 0b00000111); // 7 char
            view.setUint8(7, 0b01010100); // ASCII T
            view.setUint8(8, 0b00110001); // ASCII 1
            view.setUint8(9, 0b00100000); // ASCII space
            view.setUint8(10, 0b01001000); // ASCII H
            view.setUint8(11, 0b01001001); // ASCII I
            view.setUint8(12, 0b01000111); // ASCII G
            view.setUint8(13, 0b01001000); // ASCII H

            const reader = new BufferReader(buffer);
            const parser = new Secs2MessageParser(secsInfoMap);

            const expected: Secs2Item = {
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

            const result = parser.parse(reader);

            expect(result).toEqual(expected);
        });
        // 코드가 제대로 파싱되는지 검사
        it('데이터가 들어오면 타입에 맞게 파싱 (Binary)', () => {
            const buffer = new ArrayBuffer(3);
            const view = new DataView(buffer);
            view.setUint8(0, 0b00100001);
            view.setUint8(1, 0b00000001);
            view.setUint8(2, 0b10101010);
            const reader = new BufferReader(buffer);
            const parser = new Secs2MessageParser(secsInfoMap);

            const expected: Secs2Item = {
                info: secsInfoMap.fromSML('B'),
                data: [0b10101010],
            };

            const result = parser.parse(reader);

            expect(result).toEqual(expected);
        });

        it('데이터가 들어오면 타입에 맞게 파싱 (Boolean)', () => {
            const buffer = new ArrayBuffer(4);
            const view = new DataView(buffer);
            view.setUint8(0, 0b00100101);
            view.setUint8(1, 0b00000010);
            view.setUint8(2, 0b11110000); // 0이 아니면 true
            view.setUint8(3, 0b00000000); // 0이면 false
            const reader = new BufferReader(buffer);
            const parser = new Secs2MessageParser(secsInfoMap);

            const expected: Secs2Item = {
                info: secsInfoMap.fromSML('BOOLEAN'),
                data: [240, 0],
            };

            const result = parser.parse(reader);

            expect(result).toEqual(expected);
        })

        it('데이터가 들어오면 타입에 맞게 파싱 (A)', () => {
            const buffer = new ArrayBuffer(5);
            const view = new DataView(buffer);
            view.setUint8(0, 0b01000001);
            view.setUint8(1, 0b00000011);
            view.setUint8(2, 0b01000001); // ASCII A
            view.setUint8(3, 0b01000010); // ASCII B
            view.setUint8(4, 0b01000011); // ASCII C

            const reader = new BufferReader(buffer);
            const parser = new Secs2MessageParser(secsInfoMap);

            const expected: Secs2Item = {
                info: secsInfoMap.fromSML('A'),
                data: 'ABC',
            };

            const result = parser.parse(reader);

            expect(result).toEqual(expected);
        });

        it('데이터가 들어오면 타입에 맞게 파싱 (I8)', () => {
            const ui64max = 0xFFFF_FFFF_FFFF_FFFFn;

            const buffer = new ArrayBuffer(10);
            const view = new DataView(buffer);

            view.setUint8(0, 0b01100001);
            view.setUint8(1, 0b00001000);
            view.setBigUint64(2, ui64max);

            const reader = new BufferReader(buffer);
            const parser = new Secs2MessageParser(secsInfoMap);

            const expected: Secs2Item = {
                info: secsInfoMap.fromSML('I8'),
                data: [-1n],
            };

            const result = parser.parse(reader);

            expect(result).toEqual(expected);
        });

        it('데이터가 들어오면 타입에 맞게 파싱 (I1)', () => {
            const buffer = new ArrayBuffer(3);
            const view = new DataView(buffer);

            view.setUint8(0, 0b01100101);
            view.setUint8(1, 0b00000001);
            view.setUint8(2, 255);

            const reader = new BufferReader(buffer);
            const parser = new Secs2MessageParser(secsInfoMap);

            const expected: Secs2Item = {
                info: secsInfoMap.fromSML('I1'),
                data: [-1],
            };

            const result = parser.parse(reader);

            expect(result).toEqual(expected);
        });

        it('데이터가 들어오면 타입에 맞게 파싱 (I2)', () => {
            const buffer = new ArrayBuffer(8);
            const view = new DataView(buffer);
            view.setUint8(0, 0b01101001);
            view.setUint8(1, 0b00000110);
            view.setInt16(2, 10);
            view.setInt16(4, 20);
            view.setInt16(6, 30);

            const reader = new BufferReader(buffer);
            const parser = new Secs2MessageParser(secsInfoMap);

            const expected: Secs2Item = {
                info: secsInfoMap.fromSML('I2'),
                data: [10, 20, 30],
            };

            const result = parser.parse(reader);

            expect(result).toEqual(expected);
        });

        it('데이터가 들어오면 타입에 맞게 파싱 (I4)', () => {
            const buffer = new ArrayBuffer(6);
            const view = new DataView(buffer);

            view.setUint8(0, 0b01110001);
            view.setUint8(1, 0b00000100);
            view.setUint32(2, 0xFFFF_FFFF);

            const reader = new BufferReader(buffer);
            const parser = new Secs2MessageParser(secsInfoMap);

            const expected: Secs2Item = {
                info: secsInfoMap.fromSML('I4'),
                data: [-1],
            };

            const result = parser.parse(reader);

            expect(result).toEqual(expected);
        });

        it('데이터가 들어오면 타입에 맞게 파싱 (U8)', () => {
            const ui64max = 0xFFFF_FFFF_FFFF_FFFFn;

            const buffer = new ArrayBuffer(10);
            const view = new DataView(buffer);

            view.setUint8(0, 0b10100001);
            view.setUint8(1, 0b00001000);
            view.setBigUint64(2, ui64max);

            const reader = new BufferReader(buffer);
            const parser = new Secs2MessageParser(secsInfoMap);

            const expected: Secs2Item = {
                info: secsInfoMap.fromSML('U8'),
                data: [ui64max],
            };

            const result = parser.parse(reader);

            expect(result).toEqual(expected);
        });

        it('데이터가 들어오면 타입에 맞게 파싱 (U1)', () => {
            const buffer = new ArrayBuffer(3);
            const view = new DataView(buffer);

            view.setUint8(0, 0b10100101);
            view.setUint8(1, 0b00000001);
            view.setUint8(2, 255);

            const reader = new BufferReader(buffer);
            const parser = new Secs2MessageParser(secsInfoMap);

            const expected: Secs2Item = {
                info: secsInfoMap.fromSML('U1'),
                data: [255],
            };

            const result = parser.parse(reader);

            expect(result).toEqual(expected);
        });

        it('데이터가 들어오면 타입에 맞게 파싱 (U2)', () => {
            const buffer = new ArrayBuffer(4);
            const view = new DataView(buffer);

            view.setUint8(0, 0b10101001);
            view.setUint8(1, 0b00000010);
            view.setUint16(2, 0xFFFF);

            const reader = new BufferReader(buffer);
            const parser = new Secs2MessageParser(secsInfoMap);

            const expected: Secs2Item = {
                info: secsInfoMap.fromSML('U2'),
                data: [0xFFFF],
            };

            const result = parser.parse(reader);

            expect(result).toEqual(expected);
        });

        it('데이터가 들어오면 타입에 맞게 파싱 (U4)', () => {
            const buffer = new ArrayBuffer(6);
            const view = new DataView(buffer);

            view.setUint8(0, 0b10110001);
            view.setUint8(1, 0b00000100);
            view.setUint32(2, 0xFFFF_FFFF);

            const reader = new BufferReader(buffer);
            const parser = new Secs2MessageParser(secsInfoMap);

            const expected: Secs2Item = {
                info: secsInfoMap.fromSML('U4'),
                data: [0xFFFF_FFFF],
            };

            const result = parser.parse(reader);

            expect(result).toEqual(expected);
        });

        it('데이터가 들어오면 타입에 맞게 파싱 (F4)', () => {
            const buffer = new ArrayBuffer(6);
            const view = new DataView(buffer);
            view.setUint8(0, 0b10010001);
            view.setUint8(1, 0b00000100);
            view.setFloat32(2, 0.5);
            const reader = new BufferReader(buffer);
            const parser = new Secs2MessageParser(secsInfoMap);

            const expected: Secs2Item = {
                info: secsInfoMap.fromSML('F4'),
                data: [0.5],
            };

            const result = parser.parse(reader);

            expect(result).toEqual(expected);
        });

        it('데이터가 들어오면 타입에 맞게 파싱 (F8)', () => {
            const buffer = new ArrayBuffer(10);
            const view = new DataView(buffer);
            view.setUint8(0, 0b10000001);
            view.setUint8(1, 0b00001000);
            view.setFloat64(2, 0.123456789);
            const reader = new BufferReader(buffer);
            const parser = new Secs2MessageParser(secsInfoMap);

            const expected: Secs2Item = {
                info: secsInfoMap.fromSML('F8'),
                data: [0.123456789],
            };

            const result = parser.parse(reader);

            expect(result).toEqual(expected);
        });
    })
});