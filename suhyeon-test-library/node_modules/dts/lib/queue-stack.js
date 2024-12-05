'use strict';

function Queue () {

  var data = [],
      head = 0,
      tail = 0;

  function length () { return tail - head; }

  Object.defineProperty(this, 'size', { get: length, enumerable: true });
  Object.defineProperty(this, 'length', { get: length, enumerable: true });

  this.enqueue = this.add = function (val) {
    data[tail++] = val;
    return length();
  };

  this.dequeue = this.remove = function () {
    if (head === tail) return;
    var val = data[head++];
    if (head > 99) {
      data = data.slice(head);
      head = 0;
      tail = data.length;
    }
    return val;
  };

  this.peek = function () {
    return this.length ? data[head] : undefined;
  }.bind(this);

  this.toArray = function () { return data.slice(head, tail); };
  this.toString = function () { return this.toArray().toString(); }.bind(this);

}

function Stack () {

  var data = [];

  function length () { return data.length; }

  Object.defineProperty(this, 'size', { get: length, enumerable: true });
  Object.defineProperty(this, 'length', { get: length, enumerable: true });

  this.push = this.add = [].push.bind(data);
  this.pop = this.remove = [].pop.bind(data);
  this.peek = function () { return data[data.length - 1]; };

  this.toArray = function () { return data.slice(0); };
  this.toString = function () { return data.toString(); };

}

module.exports = {
  Queue: Queue,
  Stack: Stack
};
