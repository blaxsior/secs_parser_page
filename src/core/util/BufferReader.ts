class BufferReader {
    private view: DataView;
    private _offset: number;

    constructor(buffer: ArrayBuffer) {
        this.view = new DataView(buffer);
        this._offset = 0;
    }

    public get offset() {
        return this._offset;
    }

    public get maxOffset() {
        return this.view.byteLength;
    }

    public resetOffset() {
        this._offset = 0;
    }

    public readInt8(): number {
        const data = this.view.getInt8(this._offset);
        this._offset += 1;

        return data;
    }

    public readInt16(): number {
        const data = this.view.getInt16(this._offset);
        this._offset += 2;

        return data;
    }

    public readInt32(): number {
        const data = this.view.getInt32(this._offset);
        this._offset += 4;

        return data;
    }

    public readInt64(): bigint {
        const data = this.view.getBigInt64(this._offset);
        this._offset += 8;

        return data;
    }

    public readUInt8(): number {
        const data = this.view.getUint8(this._offset);
        this._offset += 1;

        return data;
    }

    public readUInt16(): number {
        const data = this.view.getUint16(this._offset);
        this._offset += 2;

        return data;
    }

    public readUInt32(): number {
        const data = this.view.getUint32(this._offset);
        this._offset += 4;

        return data;
    }

    public readUInt64(): bigint {
        const data = this.view.getBigUint64(this._offset);
        this._offset += 8;

        return data;
    }

    public readFloat32(): number {
        const data = this.view.getFloat32(this._offset);
        this._offset += 4;

        return data;
    }

    public readFloat64(): number {
        const data = this.view.getFloat64(this._offset);
        this._offset += 8;

        return data;
    }
}

export {
    BufferReader
}