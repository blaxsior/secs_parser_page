import { BufferWriter } from "@/core/util/BufferWriter";
import { Secs2Item, Secs2ItemSML } from "@/core/secs/item/type";

type ItemSerializeHandler = {
    (writer: BufferWriter, items: Secs2Item['data']): void
}

export class ItemSerializeResolver {
    private map: Map<Secs2ItemSML, ItemSerializeHandler>;

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

    handle(sml: Secs2ItemSML, writer: BufferWriter, items: Secs2Item['data']) {
        const handler = this.map.get(sml);
        if (!handler) throw new Error(`converter for type = ${sml} not defined`);
        if (!items) return; // 아이템 정의되지 않았다면 아무 동작 X
        handler(writer, items);
    }

    private handleBinary(writer: BufferWriter, items: Secs2Item['data']) {
        for (const item of items!) {
            writer.writeUInt8(item as number); // 'items'에 있는 데이터 사용
        }
    }

    private handleBoolean(writer: BufferWriter, items: Secs2Item['data']) {
        for (const item of items!) {
            writer.writeUInt8(item as number); // 'items'에 있는 데이터 사용
        }
    }

    private handleASCII(writer: BufferWriter, items: Secs2Item['data']) {
        writer.writeString(items as string); // 'items'에 있는 데이터 사용
    }

    private handleI8(writer: BufferWriter, items: Secs2Item['data']) {
        for (const item of items!) {
            writer.writeInt64(item as bigint); // 'items'에 있는 데이터 사용
        }
    }

    private handleI1(writer: BufferWriter, items: Secs2Item['data']) {
        for (const item of items!) {
            writer.writeInt8(item as number); // 'items'에 있는 데이터 사용
        }
    }

    private handleI2(writer: BufferWriter, items: Secs2Item['data']) {
        for (const item of items!) {
            writer.writeInt16(item as number); // 'items'에 있는 데이터 사용
        }
    }

    private handleI4(writer: BufferWriter, items: Secs2Item['data']) {
        for (const item of items!) {
            writer.writeInt32(item as number); // 'items'에 있는 데이터 사용
        }
    }

    private handleU8(writer: BufferWriter, items: Secs2Item['data']) {
        for (const item of items!) {
            writer.writeUInt64(item as bigint); // 'items'에 있는 데이터 사용
        }
    }

    private handleU1(writer: BufferWriter, items: Secs2Item['data']) {
        for (const item of items!) {
            writer.writeUInt8(item as number); // 'items'에 있는 데이터 사용
        }
    }

    private handleU2(writer: BufferWriter, items: Secs2Item['data']) {
        for (const item of items!) {
            writer.writeUInt16(item as number); // 'items'에 있는 데이터 사용
        }
    }

    private handleU4(writer: BufferWriter, items: Secs2Item['data']) {
        for (const item of items!) {
            writer.writeUInt32(item as number); // 'items'에 있는 데이터 사용
        }
    }

    private handleF4(writer: BufferWriter, items: Secs2Item['data']) {
        for (const item of items!) {
            writer.writeFloat32(item as number); // 'items'에 있는 데이터 사용
        }
    }

    private handleF8(writer: BufferWriter, items: Secs2Item['data']) {
        for (const item of items!) {
            writer.writeFloat64(item as number); // 'items'에 있는 데이터 사용
        }
    }
}