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
        Player: { //玩家
            type: cc.Node,
            default: null,
        },

        left: {
            type: cc.Node,
            default: null,
        },
        right: {
            type: cc.Node,
            default: null,
        },
        up: {
            type: cc.Node,
            default: null,
        },
        down: {
            type: cc.Node,
            default: null,
        },
        attack: {
            type: cc.Node,
            default: null,
        }
    },

    playerJS: null, //玩家脚本
    keyDown(event) {
        if (this.playerJS.hp > 0) { //如果玩家hp大于0，就是玩家活着
            switch (event.keyCode) {
                case cc.macro.KEY.a:
                    if (this.playerJS.isRun == false) { //如果能跑动是错误的
                        if (this.playerJS.playerState != 3) { //如果玩家不为爬墙
                            this.playerJS.isRun = true; //能跑动设为true
                            this.playerJS.playerDirection = 0; //玩家方向设为左
                            if (this.playerJS.playerState == 0) { //如果玩家狀態為站立
                                this.Player.getComponent(cc.Animation).play("主角左跑动画");
                            }
                        } else if (this.playerJS.playerDirection == 1) {
                            this.playerJS.playerState = 1; //玩家状态设为跳
                            this.playerJS.WallJump(); //玩家执行爬墙跳
                            this.playerJS.playerDirection = 0; //玩家方向设为左
                            this.playerJS.speed = 200; //刚起跳时速度快
                            this.playerJS.mayJump = false; //能跳设为false
                            this.Player.getComponent(cc.Animation).play("主角左跳动画");
                        }
                    }
                    break;
                case cc.macro.KEY.d:
                    if (this.playerJS.isRun == false) { //如果能跑动是错误的
                        if (this.playerJS.playerState != 3) { //如果玩家不为爬墙
                            this.playerJS.isRun = true; //能跑动设为true
                            this.playerJS.playerDirection = 1; //玩家方向设为右
                            if (this.playerJS.playerState == 0) { //如果玩家狀態為站立
                                this.Player.getComponent(cc.Animation).play("主角右跑动画");
                            }
                        } else if (this.playerJS.playerDirection == 0) {
                            this.playerJS.playerState = 1; //玩家状态设为跳
                            this.playerJS.WallJump(); //玩家执行爬墙跳
                            this.playerJS.playerDirection = 1; //玩家方向设为右
                            this.playerJS.speed = 200; //刚起跳时速度快
                            this.playerJS.mayJump = false; //能跳设为false
                            this.Player.getComponent(cc.Animation).play("主角右跳动画");
                        }
                    }
                    break;
                case cc.macro.KEY.w:
                    if (this.playerJS.playerState != 3) { //如果玩家状态不为爬墙
                        if (this.playerJS.mayJump) { //如果能跳                   
                            this.playerJS.playerState = 1; //玩家状态设为跳
                            this.playerJS.jump(); //玩家执行跳
                            this.playerJS.speed = 200; //刚起跳时速度快
                            this.playerJS.mayJump = false; //能跳设为false
                            if (this.playerJS.playerDirection == 0) { //如果玩家方向为左
                                this.Player.getComponent(cc.Animation).play("主角左跳动画");
                            } else { //否则，就是玩家方向为右
                                this.Player.getComponent(cc.Animation).play("主角右跳动画");
                            }
                        }
                    } else { //否则，就是玩家为爬墙状态
                        this.playerJS.shinState = 1; //攀爬状态设为上爬
                        if (this.playerJS.playerDirection == 0) { //如果玩家方向为左
                            this.Player.getComponent(cc.Animation).play("主角左爬动画");
                        } else { //否则，就是玩家方向为右
                            this.Player.getComponent(cc.Animation).play("主角右爬动画");
                        }
                    }
                    break;
                case cc.macro.KEY.s:
                    if (this.playerJS.playerState == 0) { //如果玩家状态为站立
                        if (this.playerJS.otherObject.node.group == "Ground") { //如果玩家依附在地面上
                            //蹲下
                        } else if (this.playerJS.otherObject.node.group == "Platform") { //如果玩家依附在平台上
                            //this.Player.y -= 30; //玩家y坐标减，为了快速从平台上落下（此语句可有可无）
                            this.playerJS.playerState = 2; //玩家状态变为下落状态
                            if (this.playerJS.playerDirection == 0) { //如果玩家方向为左
                                this.Player.getComponent(cc.Animation).play("主角左落动画");
                            } else { //否则，就是玩家方向为右
                                this.Player.getComponent(cc.Animation).play("主角右落动画");
                            }
                        }
                    } else if (this.playerJS.playerState == 3) { //如果玩家状态为爬墙
                        this.playerJS.shinState = 2 //攀爬状态设为下滑
                        if (this.playerJS.playerDirection == 0) { //如果玩家方向为左
                            this.Player.getComponent(cc.Animation).play("主角左爬动画");
                        } else { //否则，就是玩家方向为右
                            this.Player.getComponent(cc.Animation).play("主角右爬动画");
                        }
                    }
                    break;
                case cc.macro.KEY.j:
                    if (this.playerJS.isAttack == false) { //如果玩家攻击状态为false（已经是攻击状态不能再攻击，必须等攻击结束才能再次攻击）
                        if (this.playerJS.playerState != 3) //如果玩家不为爬墙状态（不能在爬墙时攻击）
                        {
                            this.playerJS.attack(); //玩家执行攻击
                        }
                    }
                    break;
            }
        }
    },

    keyUp(event) {
        if (this.playerJS.hp > 0) { //如果玩家hp大于0，就是玩家活着
            switch (event.keyCode) {
                case cc.macro.KEY.a:
                    if (this.playerJS.isRun && this.playerJS.playerDirection == 0) { //如果在跑动,并且玩家方向朝左
                        this.playerJS.isRun = false; //能跑动设为false
                        if (this.playerJS.playerState == 0) { //如果玩家狀態為站立
                            this.Player.getComponent(cc.Animation).play("主角左立动画");
                        }
                    }
                    break;
                case cc.macro.KEY.d:
                    if (this.playerJS.isRun && this.playerJS.playerDirection == 1) { //如果在跑动,并且玩家方向朝右
                        this.playerJS.isRun = false; //能跑动设为false
                        if (this.playerJS.playerState == 0) { //如果玩家狀態為站立
                            this.Player.getComponent(cc.Animation).play("主角右立动画");
                        }
                    }
                    break;
                case cc.macro.KEY.w:
                    if (this.playerJS.playerState != 3) { //如果玩家状态不为爬墙
                        if (this.playerJS.playerState == 1) { //如果玩家状态为跳,并且速度大于100
                            if (this.playerJS.speed > 100) {
                                this.playerJS.speed = 50; //玩家速度变慢
                            }
                        }
                    } else { //否则，就是玩家为爬墙状态
                        this.playerJS.shinState = 0; //攀爬状态设为不动
                        if (this.playerJS.playerDirection == 0) { //如果玩家方向为左
                            this.Player.getComponent(cc.Animation).play("主角左贴动画");
                        } else { //否则，就是玩家方向为右
                            this.Player.getComponent(cc.Animation).play("主角右贴动画");
                        }
                    }
                    break;
                case cc.macro.KEY.s:
                    if (this.playerJS.playerState == 3) {
                        this.playerJS.shinState = 0; //攀爬状态设为不动
                        if (this.playerJS.playerDirection == 0) { //如果玩家方向为左
                            this.Player.getComponent(cc.Animation).play("主角左贴动画");
                        } else { //否则，就是玩家方向为右
                            this.Player.getComponent(cc.Animation).play("主角右贴动画");
                        }
                    }
                    break;
            }
        }
    },

    // LIFE-CYCLE CALLBACKS:
    Pleftdown() {
        if (this.playerJS.hp > 0) { //如果玩家hp大于0，就是玩家活着
            if (this.playerJS.isRun == false) { //如果能跑动是错误的
                if (this.playerJS.playerState != 3) { //如果玩家不为爬墙
                    this.playerJS.isRun = true; //能跑动设为true
                    this.playerJS.playerDirection = 0; //玩家方向设为左
                    if (this.playerJS.playerState == 0) { //如果玩家狀態為站立
                        this.Player.getComponent(cc.Animation).play("主角左跑动画");
                    }
                } else if (this.playerJS.playerDirection == 1) {
                    this.playerJS.playerState = 1; //玩家状态设为跳
                    this.playerJS.WallJump(); //玩家执行爬墙跳
                    this.playerJS.playerDirection = 0; //玩家方向设为左
                    this.playerJS.speed = 200; //刚起跳时速度快
                    this.playerJS.mayJump = false; //能跳设为false
                    this.Player.getComponent(cc.Animation).play("主角左跳动画");
                }
            }
        }
    },

    Pleftdown1() {
        if (this.playerJS.hp > 0) { //如果玩家hp大于0，就是玩家活着
            if (this.playerJS.isRun == false) { //如果能跑动是错误的
                if (this.playerJS.playerState != 3) { //如果玩家不为爬墙
                    this.playerJS.isRun = true; //能跑动设为true
                    this.playerJS.playerDirection = 1; //玩家方向设为右
                    if (this.playerJS.playerState == 0) { //如果玩家狀態為站立
                        this.Player.getComponent(cc.Animation).play("主角右跑动画");
                    }
                } else if (this.playerJS.playerDirection == 0) {
                    this.playerJS.playerState = 1; //玩家状态设为跳
                    this.playerJS.WallJump(); //玩家执行爬墙跳
                    this.playerJS.playerDirection = 1; //玩家方向设为右
                    this.playerJS.speed = 200; //刚起跳时速度快
                    this.playerJS.mayJump = false; //能跳设为false
                    this.Player.getComponent(cc.Animation).play("主角右跳动画");
                }
            }
        }
    },

    Pleftdown2() {
        if (this.playerJS.hp > 0) { //如果玩家hp大于0，就是玩家活着
            if (this.playerJS.playerState != 3) { //如果玩家状态不为爬墙
                if (this.playerJS.mayJump) { //如果能跳                   
                    this.playerJS.playerState = 1; //玩家状态设为跳
                    this.playerJS.jump(); //玩家执行跳
                    this.playerJS.speed = 200; //刚起跳时速度快
                    this.playerJS.mayJump = false; //能跳设为false
                    if (this.playerJS.playerDirection == 0) { //如果玩家方向为左
                        this.Player.getComponent(cc.Animation).play("主角左跳动画");
                    } else { //否则，就是玩家方向为右
                        this.Player.getComponent(cc.Animation).play("主角右跳动画");
                    }
                }
            } else { //否则，就是玩家为爬墙状态
                this.playerJS.shinState = 1; //攀爬状态设为上爬
                if (this.playerJS.playerDirection == 0) { //如果玩家方向为左
                    this.Player.getComponent(cc.Animation).play("主角左爬动画");
                } else { //否则，就是玩家方向为右
                    this.Player.getComponent(cc.Animation).play("主角右爬动画");
                }
            }
        }
    },

    Pleftdown3() {
        if (this.playerJS.hp > 0) { //如果玩家hp大于0，就是玩家活着
            if (this.playerJS.playerState == 0) { //如果玩家状态为站立
                if (this.playerJS.otherObject.node.group == "Ground") { //如果玩家依附在地面上
                    //蹲下
                } else if (this.playerJS.otherObject.node.group == "Platform") { //如果玩家依附在平台上
                    //this.Player.y -= 30; //玩家y坐标减，为了快速从平台上落下（此语句可有可无）
                    this.playerJS.playerState = 2; //玩家状态变为下落状态
                    if (this.playerJS.playerDirection == 0) { //如果玩家方向为左
                        this.Player.getComponent(cc.Animation).play("主角左落动画");
                    } else { //否则，就是玩家方向为右
                        this.Player.getComponent(cc.Animation).play("主角右落动画");
                    }
                }
            } else if (this.playerJS.playerState == 3) { //如果玩家状态为爬墙
                this.playerJS.shinState = 2 //攀爬状态设为下滑
                if (this.playerJS.playerDirection == 0) { //如果玩家方向为左
                    this.Player.getComponent(cc.Animation).play("主角左爬动画");
                } else { //否则，就是玩家方向为右
                    this.Player.getComponent(cc.Animation).play("主角右爬动画");
                }
            }
        }
    },

    Pleftdown4() {
        if (this.playerJS.hp > 0) { //如果玩家hp大于0，就是玩家活着
            if (this.playerJS.isAttack == false) { //如果玩家攻击状态为false（已经是攻击状态不能再攻击，必须等攻击结束才能再次攻击）
                if (this.playerJS.playerState != 3) //如果玩家不为爬墙状态（不能在爬墙时攻击）
                {
                    this.playerJS.attack(); //玩家执行攻击
                }
            }
        }
    },

    Pleftu() {
        if (this.playerJS.hp > 0) { //如果玩家hp大于0，就是玩家活着
            if (this.playerJS.isRun && this.playerJS.playerDirection == 0) { //如果在跑动,并且玩家方向朝左
                this.playerJS.isRun = false; //能跑动设为false
                if (this.playerJS.playerState == 0) { //如果玩家狀態為站立
                    this.Player.getComponent(cc.Animation).play("主角左立动画");
                }
            }
        }
    },

    Pleftu1() {
        if (this.playerJS.hp > 0) { //如果玩家hp大于0，就是玩家活着
            if (this.playerJS.isRun && this.playerJS.playerDirection == 1) { //如果在跑动,并且玩家方向朝右
                this.playerJS.isRun = false; //能跑动设为false
                if (this.playerJS.playerState == 0) { //如果玩家狀態為站立
                    this.Player.getComponent(cc.Animation).play("主角右立动画");
                }
            }
        }
    },

    Pleftu2() {
        if (this.playerJS.hp > 0) { //如果玩家hp大于0，就是玩家活着
            if (this.playerJS.playerState != 3) { //如果玩家状态不为爬墙
                if (this.playerJS.playerState == 1) { //如果玩家状态为跳,并且速度大于100
                    if (this.playerJS.speed > 100) {
                        this.playerJS.speed = 50; //玩家速度变慢
                    }
                }
            } else { //否则，就是玩家为爬墙状态
                this.playerJS.shinState = 0; //攀爬状态设为不动
                if (this.playerJS.playerDirection == 0) { //如果玩家方向为左
                    this.Player.getComponent(cc.Animation).play("主角左贴动画");
                } else { //否则，就是玩家方向为右
                    this.Player.getComponent(cc.Animation).play("主角右贴动画");
                }
            }
        }
    },

    Pleftu3() {
        if (this.playerJS.hp > 0) { //如果玩家hp大于0，就是玩家活着
            if (this.playerJS.playerState == 3) {
                this.playerJS.shinState = 0; //攀爬状态设为不动
                if (this.playerJS.playerDirection == 0) { //如果玩家方向为左
                    this.Player.getComponent(cc.Animation).play("主角左贴动画");
                } else { //否则，就是玩家方向为右
                    this.Player.getComponent(cc.Animation).play("主角右贴动画");
                }
            }
        }
    },

    // Pleftu4() {
    //     if (this.playerJS.hp > 0) { //如果玩家hp大于0，就是玩家活着
    //     }
    // },

    onLoad() {

        this.left.on(cc.Node.EventType.TOUCH_START, this.Pleftdown, this);
        this.left.on(cc.Node.EventType.TOUCH_END, this.Pleftu, this);

        this.right.on(cc.Node.EventType.TOUCH_START, this.Pleftdown1, this);
        this.right.on(cc.Node.EventType.TOUCH_END, this.Pleftu1, this);

        this.up.on(cc.Node.EventType.TOUCH_START, this.Pleftdown2, this);
        this.up.on(cc.Node.EventType.TOUCH_END, this.Pleftu2, this);

        this.down.on(cc.Node.EventType.TOUCH_START, this.Pleftdown3, this);
        this.down.on(cc.Node.EventType.TOUCH_END, this.Pleftu3, this);

        this.attack.on(cc.Node.EventType.TOUCH_START, this.Pleftdown4, this);
        //this.attack.on(cc.Node.EventType.TOUCH_END, this.Pleftu4, this);

        var manager = cc.director.getCollisionManager(); //获取碰撞组件
        manager.enabled = true; //开启碰撞监听
        //manager.enabledDebugDraw = true; //开启碰撞组件Debug

        this.playerJS = this.Player.getComponent("Player"); //获取玩家脚本

        //系统事件，当键被按下时调用keyDown回调函数处理
        //cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.keyDown, this);
        //系统事件，当键弹起时调用keyUp回调函数处理
        //cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.keyUp, this);
    },

    start() {

    },

    // update (dt) {},
});
