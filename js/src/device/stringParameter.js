import Utils from './utils';

export default class StringParameter {
    constructor (obj = {}) {
        /**
         * ID.
         */
        this.id = Utils.randomString();

        /**
         * 채널에 표시될 항목의 이름.
         */
        this.name = obj.name || '';

        /**
         * 값.
         */
        this.value = (typeof obj.value == 'string') ? obj.value : '';
    }
}