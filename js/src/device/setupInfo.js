import Utils from './utils';
export default class SetupInfo {
    constructor (obj = {}) {
        obj = Utils.snakeObjToCamelObj(obj);

        this.serialDevice = obj.serialDevice || '';
        this.baudRate = obj.baudRate || '';
        this.serialDeviceMcu = obj.serialDeviceMcu || '';
        this.baudRateMcu = obj.baudRateMcu || '';
        this.requestInterval = obj.requestInterval || '';
        this.sdrChannel = obj.sdrChannel || '';
        this.serverType = obj.serverType || '';
        this.serverIp = obj.serverIp || '';
        this.serverPort = obj.serverPort || '';
        this.serverTopic = obj.serverTopic || '';
        this.apUse = !!obj.apUse;
        this.apSsid = obj.apSsid || '';
        this.apPassword = obj.apPassword || '';
        this.apChannel = obj.apChannel || '';
        this.useBootingLog = !!obj.useBootingLog;
        this.useMessageLog = !!obj.useMessageLog;
        this.useNetworkLog = !!obj.useNetworkLog;
    }

    getDataObject() {
        const me = this;

        return {
            serialDevice: me.serialDevice,
            baudRate: me.baudRate,
            serialDeviceMcu: me.serialDeviceMcu,
            baudRateMcu: me.baudRateMcu,
            requestInterval: me.requestInterval,
            sdrChannel: me.sdrChannel,
            serverType: me.serverType,
            serverIp: me.serverIp,
            serverPort: me.serverPort,
            serverTopic: me.serverTopic,
            apUse: (me.apUse ? 1 : 0),
            apSsid: me.apSsid,
            apPassword: me.apPassword,
            apChannel: me.apChannel,
            useBootingLog: (me.useBootingLog ? 1 : 0),
            useMessageLog: (me.useMessageLog ? 1 : 0),
            useNetworkLog: (me.useNetworkLog ? 1 : 0)
        };
    }

    validate() {
        const me = this;

        const isOk = me.serialDevice != me.serialDeviceMcu;

        return {
            isOk: isOk,
            message: isOk ? '' : 'SERIAL DEVICE 는 같은 이름을 가질 수 없습니다.',
        };
    }
}