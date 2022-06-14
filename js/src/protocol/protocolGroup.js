import Protocol from './protocol';

export default class ProtocolGroup {
    constructor (obj = {}) {
        this.isOneWay = (typeof obj.isOneWay == 'boolean') ? obj.isOneWay : true;

        const tempArr = Array.isArray(obj.array) ? obj.array : [];

        this.array = tempArr.map(function (obj) {
            return (obj instanceof Protocol) ? obj : new Protocol(obj);
        });
    }

    add(protocolObj) {
        const me = this;

        me.array.push(new Protocol(protocolObj));
    }

    delete(index) {
        const me = this;

        if (me.array.length > index) {
            me.array.splice(index, 1);
        }
    }
}