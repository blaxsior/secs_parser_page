import { describe, expect, it } from 'vitest';
import { secsInfoMap } from './secs_item_info';
import { Secs2ItemInfo } from './type';

describe("Secs Item Map", () => {
    describe("fromSML", () => {
        it("sml에 대응되는 타입이 정의되어 있으면 반환", () => {
            const sml = 'L'; // 리스트
            const expected: Secs2ItemInfo<'L'> = { sml: 'L', formatCode: 0o00, itemSize: 1};
    
            const result = secsInfoMap.fromSML(sml);
            expect(expected).toEqual(result);
        });

        it("sml로 정의되지 않은 타입은 에러", () => {
            const sml = 'not_defined'; // 리스트

            expect(() => {
                //@ts-ignore
                secsInfoMap.fromSML(sml);
            }).toThrow();
        })
    });

    describe("fromFormatCode", () => {
        it("format code에 대응되는 타입이 정의되어 있으면 반환",() => {
            const formatCode = 0o00; // 리스트
            const expected = { sml: 'L', formatCode: 0o00, itemSize: 1 };
    
            const result = secsInfoMap.fromFormatCode(formatCode);
            expect(expected).toEqual(result);
        });

        it("format code로 정의되지 않은 타입은 에러", () => {
            const formatCode = 0o77; // 정의되지 않은 format code

            expect(() => {
                secsInfoMap.fromFormatCode(formatCode);
            }).toThrow();
        })
    })
});