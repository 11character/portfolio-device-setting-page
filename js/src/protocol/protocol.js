import SendRow from './sendRow';
import RecevieRow from './recevieRow';

export default class Protocol {
    constructor (obj = {}) {
        this.send = new SendRow(obj.send || {});

        const tempArr = Array.isArray(obj.recevieArray) ? obj.recevieArray : [];

        this.recevieName = obj.recevieName || '';

        this.recevieArray = tempArr.map(function (obj) {
            return (obj instanceof RecevieRow) ? obj : new RecevieRow(obj);
        });
    }

    add(obj) {
        const me = this;

        me.recevieArray.push(new RecevieRow(obj));
    }

    delete(index) {
        const me = this;

        if (me.recevieArray.length > index) {
            me.recevieArray.splice(index, 1);
        }
    }

    swapPosition(currentIndex, targetIndex) {
        const me = this;

        const arr = me.recevieArray.splice(currentIndex, 1);

        if (arr.length) {
            const item = arr[0];

            me.recevieArray.splice(targetIndex, 0, item);
        }
    }

    setArray(dataArray) {
        const me = this;

        me.recevieArray.splice(0);

        for (let i = 0; i < dataArray.length; i++) {
            me.add(dataArray[i]);
        }
    }
}