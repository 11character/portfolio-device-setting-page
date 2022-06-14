export default class ChartData {
    constructor (obj = {}) {
        this.y = obj.y || 0;
        this.date = obj.date || new Date();
    }
}