export default class SendRow {
    constructor (obj = {}) {
        this.type = obj.type || 'ASCII';
        this.value = obj.value || '';
    }
}