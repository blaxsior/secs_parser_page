import { describe, expect, it } from 'vitest';
import { Secs2MessageParser } from './parser';
import { Secs2Item } from './item/secs';

describe('SecsParser Test', () => {
    it("should parse SecsItem To binary byte array", (c) => {
        const parser = new Secs2MessageParser();

        const item: Secs2Item = {
        };
        
        const result = parser.parse(item);
        
        expect(result);
    });
});