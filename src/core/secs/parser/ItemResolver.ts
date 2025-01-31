import { BufferReader } from "../../util/BufferReader";
import { Secs2Item, Secs2ItemSML } from "../item/secs";

type ItemConvertHandler = {
    (reader: BufferReader, length: number): Secs2Item['data']
}

export class ItemConvertResolver {
    private map: Map<Secs2ItemSML, ItemConvertHandler>;

    constructor() {
        this.map = new Map();
        this.init();
    }

    init() {
        this.map.set('B', this.handleBinary);
        this.map.set('BOOLEAN', this.handleBoolean);
        this.map.set('A', this.handleASCII);
        this.map.set('I8', this.handleI8);
        this.map.set('I1', this.handleI1);
        this.map.set('I2', this.handleI2);
        this.map.set('I4', this.handleI4);
        this.map.set('U8', this.handleU8);
        this.map.set('U1', this.handleU1);
        this.map.set('U2', this.handleU2);
        this.map.set('U4', this.handleU4);
        this.map.set('F4', this.handleF4);
        this.map.set('F8', this.handleF8);
    }

    handle(sml: Secs2ItemSML, reader: BufferReader, length: number): Secs2Item['data'] {
        const handler = this.map.get(sml);
        if (!handler) throw new Error(`converter for type = ${sml} not defined`);
        return handler(reader, length);
    }

    private handleBinary(reader: BufferReader, length: number) {
        const data: number[] = [];
        for (let i = 0; i < length; i++) {
            data.push(reader.readUInt8());
        }
        return data;
    }

    private handleBoolean(reader: BufferReader, length: number) {
        const data: boolean[] = [];
        for (let i = 0; i < length; i++) {
            data.push(reader.readUInt8() > 0);
        }
        return data;
    }

    private handleASCII(reader: BufferReader, length: number) {
        return reader.readString(length);
    }

    private handleI8(reader: BufferReader, length: number) {
        const data: bigint[] = [];
        for (let i = 0; i < ~~(length / 8); i++) {
            data.push(reader.readInt64());
        }
        return data;
    }

    private handleI1(reader: BufferReader, length: number) {
        const data: number[] = [];
        for (let i = 0; i < length; i++) {
            data.push(reader.readInt8());
        }
        return data;
    }

    private handleI2(reader: BufferReader, length: number) {
        const data: number[] = [];
        for (let i = 0; i < ~~(length / 2); i++) {
            data.push(reader.readInt16());
        }
        return data;
    }

    private handleI4(reader: BufferReader, length: number) {
        const data: number[] = [];
        for (let i = 0; i < ~~(length / 4); i++) {
            data.push(reader.readInt32());
        }
        return data;
    }

    private handleU8(reader: BufferReader, length: number) {
        const data: bigint[] = [];
        for (let i = 0; i < ~~(length / 8); i++) {
            data.push(reader.readUInt64());
        }
        return data;
    }

    private handleU1(reader: BufferReader, length: number) {
        const data: number[] = [];
        for (let i = 0; i < length; i++) {
            data.push(reader.readUInt8());
        }
        return data;
    }

    private handleU2(reader: BufferReader, length: number) {
        const data: number[] = [];
        for (let i = 0; i < ~~(length / 2); i++) {
            data.push(reader.readUInt16());
        }
        return data;
    }

    private handleU4(reader: BufferReader, length: number) {
        const data: number[] = [];
        for (let i = 0; i < ~~(length / 4); i++) {
            data.push(reader.readUInt32());
        }
        return data;
    }

    private handleF4(reader: BufferReader, length: number) {
        const data: number[] = [];
        for (let i = 0; i < ~~(length / 4); i++) {
            data.push(reader.readFloat32());
        }
        return data;
    }

    private handleF8(reader: BufferReader, length: number) {
        const data: number[] = [];
        for (let i = 0; i < ~~(length / 8); i++) {
            data.push(reader.readFloat64());
        }
        return data;
    }
}
