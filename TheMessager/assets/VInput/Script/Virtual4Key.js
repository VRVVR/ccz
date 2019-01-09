/**
 * 虚拟4按键，模拟W,A,S,D四个按键
 *
 * # HOW TO USE:
 * ```js
 * var Virtual4Key = require('Virtual4Key');
 * 
 * cc.Class({
 *     extends: cc.Component,
 * 
 *     properties: {
 *         v4key: Virtual4Key,
 *     },
 *     start () {
 *         this.v4key.addListener('press',(keyName)=>{
 *             this.getComponent(cc.Label).string = 'press ' + keyName;
 *         });
 *         this.v4key.addListener('release',(keyName)=>{
 *             this.getComponent(cc.Label).string = 'release ' + keyName;
 *         })
 *     },
 * 
 * });
 * ```
 */

cc.Class({
  extends: cc.Component,

  properties: {
    _up: cc.Node,
    _down: cc.Node,
    _left: cc.Node,
    _right: cc.Node,

  
    _listeners: Array // 事件侦听器
  },

  onLoad() {
    this._listeners = new Array(4);
    this._up = cc.find("up", this.node);
    this._down = cc.find("down", this.node);
    this._left = cc.find("left", this.node);
    this._right = cc.find("right", this.node);
    this._bindTouch(this._up);
    this._bindTouch(this._down);
    this._bindTouch(this._left);
    this._bindTouch(this._right);
  },

  _bindTouch(node) {
    node.on("touchstart", this.onTouchStart, this);
    node.on("touchend", this.onTouchCanceled, this);
    node.on("touchcancel", this.onTouchCanceled, this);
  },

  onTouchStart(e) {
    let keyName = "";
    const k = e.target;
    if (k == this._up) {
      keyName = "up";
    } else if (k == this._down) {
      keyName = "down";
    } else if (k == this._left) {
      keyName = "left";
    } else if (k == this._right) {
      keyName = "right";
    }

    this._invokeKeyPress(keyName);
  },
  onTouchCanceled(e) {
    let keyName = "";
    const k = e.target;
    if (k == this._up) {
      keyName = "up";
    } else if (k == this._down) {
      keyName = "down";
    } else if (k == this._left) {
      keyName = "left";
    } else if (k == this._right) {
      keyName = "right";
    }
    this._invokeKeyRelease(keyName);
  },

  _invokeKeyPress(keyName) {
    this._listeners.forEach(f => {
      if (f.type == "press") {
        f.fn(keyName);
      }
    });
  },
  _invokeKeyRelease(keyName) {
    this._listeners.forEach(f => {
      if (f.type == "release") {
        f.fn(keyName);
      }
    });
  },

  addListener(eventName, fn) {
      let l = {
          type: eventName,
          fn,
      }
    this._listeners.push(l);
  }
});
