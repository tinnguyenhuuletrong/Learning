const { get, set } = require("lodash");

class GroupByTimeLabel {
  constructor({ eventMapperFunc, timeLabelFunc, timeKeyPath = "time" }) {
    this.eventMapperFunc = eventMapperFunc;
    this.timeLabelFunc = timeLabelFunc;
    this.timeKeyPath = timeKeyPath;
    this.summaryKey = "summary";
    this.snapshot = {};
  }

  processEvent(event) {
    const timeLabels = this.timeLabelFunc(get(event, this.timeKeyPath));

    const summary = this.eventMapperFunc(event);
    const keys = Object.keys(summary);
    for (const k of keys) {
      const timeLabelsWithPath = timeLabels.map(itm => [
        ...itm,
        this.summaryKey,
        k
      ]);

      const val = summary[k];

      if (Array.isArray(val)) this._append(timeLabelsWithPath, val);
      else this._inc(timeLabelsWithPath, val);
    }
  }

  _inc(paths, byValue) {
    for (const p of paths) {
      const currentVal = get(this.snapshot, p, 0);
      set(this.snapshot, p, currentVal + byValue);
    }
  }

  _append(paths, val) {
    for (const p of paths) {
      const currentVal = get(this.snapshot, p, []);
      set(this.snapshot, p, [...currentVal, val]);
    }
  }
}
module.exports = GroupByTimeLabel;
