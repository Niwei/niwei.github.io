// jpBC

import uuid from "./uuid.js";

var __EVENT__ = "subscribe_" + uuid();

function __generateEventIfNotExisted() {
    if (!this[__EVENT__]) this[__EVENT__] = {};
}

export default {
    hasListener: function (name) {
        __generateEventIfNotExisted.call(this);
        var events = this[__EVENT__];
        return events && events[name] && events[name].length;
    },

    on: function (names, callback, context, once = false) {
        __generateEventIfNotExisted.call(this);
        for (const name of [].concat(names)) {
            if (!this[__EVENT__][name]) this[__EVENT__][name] = [];
            this[__EVENT__][name].push([callback, context, once]);
        }

        return this;
    },

    once: function (names, callback, context) {
        return this.on(names, callback, context, true);
    },

    off: function (names, callback) {
        __generateEventIfNotExisted.call(this);
        if (arguments.length === 0) {
            this[__EVENT__] = {};
            return;
        }

        let events = this[__EVENT__];
        for (const name of names) {
            if (events[name] === undefined) continue;
            if (callback === undefined) {
                events[name].length = 0;
                continue;
            }
            events[name] = events[name].filter(function (one) {
                return one[0] !== callback;
            });
        }

        return this;
    },

    emit: function (name, ...data) {
        if (name === "loaded") {
            console.log(...data);
        }
        let canceled = false;
        __generateEventIfNotExisted.call(this);
        const event = this[__EVENT__][name] || [];
        for (const one of event) {
            let [callback, context = this, once = false] = one;
            const result = callback.apply(context, data);
            if (once) this.off(name, callback);
            if (result === false) canceled = true;
        }

        return canceled;
    },
};
