function extendPrototype(source, target) {
  source.prototype = Object.create(target.prototype, {
    constructor: {
      value: source,
    },
  });
}

exports.extendPrototype = extendPrototype;
