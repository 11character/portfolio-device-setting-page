import Utils from './utils';
import Sensor from './sensor';

export default class Channel {
    constructor (obj = {}) {
        this.id = Utils.randomString();
        this.number = obj.number || 0;
        this.parent = obj.parent || null;
        this.name = obj.name || '';
        this.type = obj.type || 'analog';
        this.sensor = new Sensor(obj.sensor || {type: this.type});
    }
}