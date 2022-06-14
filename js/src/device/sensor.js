export default class Sensor {
    constructor (obj = {}) {
        this.id = (typeof obj.id == 'number') ? obj.id : -1;
        this.type = obj.type || '';
        this.name = obj.name || 'NONAME';
        this.isUse = (typeof obj.isUse == 'boolean') ? obj.isUse : true;
        this.configFileUrl = obj.configFileUrl || '';

        /**
         * 센서값.
         * 모든 종류의 센서값을 넣을 수 있도록 한다.
         * 타입에 따라 사용되는 항목은 외부에서 결정한다. (ex 시리얼 센서로 사용될 경우 protocol에만 값을 넣다뺐다 한다.)
         */
        this.minVoltage = obj.minVoltage;
        this.maxVoltage = obj.maxVoltage;
        this.minValue = obj.minValue;
        this.maxValue = obj.maxValue;
        this.protocol = obj.protocol;
        this.uuid = obj.uuid;
    }

    setValueFromDb(obj) {
        const me = this;

        me.id = obj.SEQ_ID;
        me.name = obj.NAME;
        me.isUse = (obj.IS_USE === 1);

        me.minVoltage = obj.MIN_VOLTAGE;
        me.maxVoltage = obj.MAX_VOLTAGE;
        me.minValue = obj.MIN_VALUE;
        me.maxValue = obj.MAX_VALUE;
        me.protocol = obj.PROTOCOL;
        me.uuid = obj.UUID;
    }

    getDataObject() {
        const me = this;

        const obj = new Sensor(me);

        obj.isUse = (me.isUse ? 1 : 0);

        return obj;
    }
}