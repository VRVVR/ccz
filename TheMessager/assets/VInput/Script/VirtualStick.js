/**
 * 虚拟摇杆
 * 摇杆按钮可以在摇杆圆盘中任意移动
 * 根据按钮与按钮原点的距离，判断移动方向
 * 
 * # HOW TO USE:
 * ```js 
 *  var VirtualStick = require('VirtualStick')
 *
 *  cc.Class({
 *      extends: cc.Component,  // 放置包含VirtualStick组件的节点
 *
 *      properties: {
 *          vstick: VirtualStick,
 *      },
 * 
 *     start () {
 *          this.vstick.addListener((pos)=>{
 *              console.log("摇杆相对初始原点位置", pos);
 *          })
 *      },
 *  });
 * ```
 */

cc.Class({
    extends: cc.Component,

    properties: {
        handle: cc.Sprite,     // 可移动的按钮
        _oriPos : cc.Vec2,      // 原始位置

        enableLog:{
  //          type:cc.Boolean,      // 是否启用日志
            default:true,
            tooltip:'是否启用虚拟摇杆的日志'
        },

        limitedHandle: {
//            type:cc.Boolean, // 是否启用范围圈
            default:false,
            tooltip:"是否限制按钮的移动范围"
        },
        _limitRadius:{
            default: 0,
        } ,  // 范围圈半径

        _listeners:Array,       // 事件侦听器
    },

    onLoad () {
        if(!this.handle) {
            this.handle = cc.find("handle",this.node);
        }
        this._oriPos = this.node.position;
        
        let pos = this.node.position;   // 当前坐标，为0,0
        let worldpos = this.node.convertToWorldSpaceAR(pos);    // 转换成世界坐标,480,320
        this.enableLog && console.log(pos,worldpos);

        this._limitRadius = this.node.width * 0.5;

        this._listeners = new Array();
    },

    start () {
        this.handle.on('touchmove',this.onTouchMoved,this);
        this.handle.on('touchend',this.onTouchCanceled,this);
        this.handle.on('touchcancel',this.onTouchCanceled,this);
    },

    addListener(fn) {
        this._listeners.push(fn)
    },

    isInLimitCircle(pos) {
        if (!this.limitedHandle) return true;

        let d = pos.mag();
        this.enableLog && console.log('长度：',d);
        return d <= this._limitRadius;
    },

    onTouchMoved(event) {
        let loc = event.getLocation();
        let pos = this.node.convertTouchToNodeSpaceAR(event.touch)

        this.enableLog && console.log("触屏坐标：",loc,"触屏相对坐标：",pos);
        

        

        if (this.isInLimitCircle(pos) ) {
            this.handle.position = pos;    

            this._listeners.forEach(fn => fn(pos));
        }
        
    },

    onTouchCanceled(event) {
        this.reset();   
    },

    reset() {
        this.node.setPosition(this._oriPos);
        this._resetBtnPos();
    },
    // 将摇杆按钮重置
    _resetBtnPos() {
        this.handle.position = cc.Vec2.ZERO;
    },

});
