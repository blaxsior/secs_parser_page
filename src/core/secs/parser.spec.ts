import { beforeEach, describe, expect, it } from 'vitest';
import { Secs2MessageParser } from './parser';
import { Secs2ItemInfo } from './item/secs';
import { secsInfoMap } from './item/secs_item_info';
import { BufferReader } from '../util/BufferReader';

describe('SecsParser Test', () => {
    let parser: Secs2MessageParser;

    beforeEach(() => {
        parser = new Secs2MessageParser(secsInfoMap);
    });

    describe('parseType', () => {
        it("포맷 코드를 파싱, 대응되는 타입 획득", () => {
            const data = 0b000000_01; // 길이가 1인 list
            const expected: Secs2ItemInfo<'L'> = { sml: 'L', formatCode: 0o00 };

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

        it('읽는 byte 개수 = count가 [0..3]을 벗어나면 예외 발생', () => {

            const wrong_count1 = -1;
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
        it('데이터가 들어오면 타입에 맞게 파싱', () => {
            
        });
    })
});