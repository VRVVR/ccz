// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        byX: 0, //x轴移动的距离
        byY: 0, //y轴移动的距离
        time: 0, //时间，moveBy所需的时间
        isBy: true, //是移动的（控制平台是否能移动）
        mayStart: true, //可开启（控制是否可以开启平台）
        assistValue: 0, //辅助值，用来解决平台移动太快人物刷新跟不上
        mayReset: false, //可否重置
    },

    havePlayer: false, //有玩家（玩家是否站在平台上）
    selfX: null, //平台的坐标（上一帧）
    selfY: null, //
    timer: null, //计时器
    initialIsBy: null, //初始移动状态

    otherObject: null, //另一个对象（用来获取玩家）
    onCollisionEnter: function (other, self) {
        if (other.node.group == "Player") {
            // if(self.node.group == "Wall") {
            //     this.node.getComponent(cc.BoxCollider).size.width+=50;
            // }        
            this.otherObject = other;
            this.isBy = true;
            this.havePlayer = true;
            this.selfX = this.node.x;
            this.selfY = this.node.y;
        }
    },

    onCollisionExit: function (other, self) {
        this.havePlayer = false;
        //this.node.getComponent(cc.BoxCollider).size.width-=50;
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
    },


    thisPosition: null, //当前位置，用来定位可移动平台的初始位置
    action: null,
    start() {
        var By1 = cc.moveBy(this.time, cc.v2(this.byX, this.byY));
        var By2 = cc.moveBy(this.time, cc.v2(-this.byX, -this.byY));
        this.action = cc.repeatForever(cc.sequence(By1, By2));

        this.thisPosition = this.node.position; //属性当前位置等于当前节点的位置

        this.timer = 0;
        this.initialIsBy = this.isBy;
    },

    directionLeftRight: null, //方向，0左1右，用来判断平台左右移动是否需要用assistValue辅助值解决玩家更新跟不上平台移动
    directionUpDown: null, //方向，0上1下，用来判断平台上下移动是否需要用assistValue辅助值解决玩家更新跟不上平台移动
    update(dt) {
        if (this.isBy == true) {
            if (this.mayStart == true) {
                this.node.runAction(this.action);
                this.mayStart = false;
            }
        }

        if (this.otherObject != null) { //如果另一个对象不为空
            if (this.otherObject.node.group == "Player") { //如果另一个对象是玩家分组的
                if (this.otherObject.node.getComponent("Player").hp > 0) { //如果玩家的生命值大于0，就是玩家是活着的
                    if (this.havePlayer) { //如果玩家依附在移动物体上
                        this.otherObject.node.x += (this.node.x - this.selfX); //玩家x坐标 +=（移动物x坐标相对于上一帧的偏移量）
                        if (this.node.x - this.selfX < 0 && this.directionLeftRight != 0) { //如果移动物x坐标相对于上一帧的偏移量小于0，就是在往左移动  并且 移动物方向不为左，就是只有刚开始左右移动或者转向时可执行 
                            this.otherObject.node.x -= this.assistValue; //玩家x坐标减辅助值
                            if (this.directionLeftRight == 1) { //如果移动物方向为右，就是说明已经执行过一次玩家x坐标加辅助值
                                this.otherObject.node.x -= this.assistValue; //玩家x坐标减辅助值
                            }
                            this.directionLeftRight = 0; //平台移动方向为左
                        } else if (this.node.x - this.selfX > 0 && this.directionLeftRight != 1) {
                            this.otherObject.node.x += this.assistValue;
                            if (this.directionLeftRight == 0) {
                                this.otherObject.node.x += this.assistValue;
                            }
                            this.directionLeftRight = 1;
                        }
                        this.otherObject.node.y += (this.node.y - this.selfY); //玩家y坐标 +=（移动物y坐标相对于上一帧的偏移量）
                        if (this.node.y - this.selfY < 0 && this.directionUpDown != 0) { //如果移动物y坐标相对于上一帧的偏移量小于0，就是在往下移动  并且 移动物方向不为下，就是只有刚开始上下移动或者转向时可执行
                            this.otherObject.node.y -= this.assistValue; //玩家y坐标减辅助值
                            if (this.directionUpDown == 1) { //如果移动物方向为上，就是说明已经执行过一次玩家y坐标加辅助值
                                this.otherObject.node.y -= this.assistValue; //玩家y坐标减辅助值
                            }
                            this.directionUpDown = 0; //平台移动方向为下
                        } else if (this.node.y - this.selfY > 0 && this.directionUpDown != 1) {
                            this.otherObject.node.y += this.assistValue;
                            if (this.directionUpDown == 0) {
                                this.otherObject.node.y += this.assistValue;
                            }
                            this.directionUpDown = 1;
                        }

                        this.selfX = this.node.x; //更新移动物体的上一帧x坐标，上一帧的x坐标等于当前帧的x坐标
                        this.selfY = this.node.y;
                    }
                } else if(this.mayReset){ //否则，就是玩家死了
                    this.node.stopAction(this.action); //停止动画
                    this.isBy = this.initialIsBy; //是移动状态设为false
                    this.mayStart = true; //能否启动设为true
                    this.node.position = this.thisPosition; //重置平台坐标
                    this.directionLeftRight = null; //重置移动物的左右移动状态
                    this.directionUpDown = null; //重置移动物的上下移动状态
                }
            }
        }
    },
});
