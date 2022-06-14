export default class RecevieRow {
    constructor (obj = {}) {
        this.name = obj.name || '';
        this.type = obj.type || 'ASCII';
        this.start = (typeof obj.start == 'number') ? obj.start : 0;
        this.length = (typeof obj.length == 'number') ? obj.length : 1;
    }
}