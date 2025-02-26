import { beforeEach, describe, expect, it } from 'vitest';
import { Secs2CompItemConverter } from './comp_converter';
import { Secs2CompItem, Secs2Item } from '../item/type';
import { secsInfoMap } from '../item/secs_item_info';

describe('ComponentItemConverter', () => {
    describe('convert', () => {
        let converter: Secs2CompItemConverter;

        beforeEach(() => {
            converter = new Secs2CompItemConverter(secsInfoMap);
        })

        it("SecsComponentItem을 SecsItem으로 변환한다.(I1)", () => {
            const item: Secs2CompItem = {
                type: 'I1',
                data: ['10', '12']
            };
            
            const expected: Secs2Item = {
                info: secsInfoMap.fromSML('I1'),
                data: [10, 12]
            };

            const result: Secs2Item = converter.convert(item);
            expect(result).toEqual(expected);
        });

        it("SecsComponentItem을 SecsItem으로 변환한다.(I2)", () => {
            const item: Secs2CompItem = {
                type: 'I2',
                data: ['10', '32767']
            };
            
            const expected: Secs2Item = {
                info: secsInfoMap.fromSML('I2'),
                data: [10, 32767]
            };

            const result: Secs2Item = converter.convert(item);
            expect(result).toEqual(expected);
        });

        it("SecsComponentItem을 SecsItem으로 변환한다.(B)", () => {
            const item: Secs2CompItem = {
                type: 'B',
                data: ['10', '46']
            };
            
            const expected: Secs2Item = {
                info: secsInfoMap.fromSML('B'),
                data: [10, 46]
            };

            const result: Secs2Item = converter.convert(item);
            expect(result).toEqual(expected);
        });

        it("SecsComponentItem을 SecsItem으로 변환한다.(boolean)", () => {
            const item: Secs2CompItem = {
                type: 'BOOLEAN',
                data: ['13', '42']
            };
            
            const expected: Secs2Item = {
                info: secsInfoMap.fromSML('BOOLEAN'),
                data: [13, 42]
            };

            const result: Secs2Item = converter.convert(item);
            expect(result).toEqual(expected);
        });

        it("SecsComponentItem을 SecsItem으로 변환한다.(float)", () => {
            const item: Secs2CompItem = {
                type: 'F8',
                data: ['13.5', '42.7']
            };
            
            const expected: Secs2Item = {
                info: secsInfoMap.fromSML('F8'),
                data: [13.5, 42.7]
            };

            const result: Secs2Item = converter.convert(item);
            expect(result).toEqual(expected);
        });
    });
});