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
        // jumpHeight: { //跳跃高度
        //     default: 0, //默认值
        //     type: number, //属性类型
        //     //visible: true, //属性检测器面板中是否显示
        //     //displayName: "玩家跳跃高度", //属性检测器面板中显示此名字
        // },
        camera: { //摄像机
            type: cc.Node, //属性类型
            default: null, //默认值
        },
        jumpHeight: 200, //跳跃高度
        playerState: 2, //玩家状态 0站立 1跳 2落 3爬墙
        isRun: false,  //是否跑动
        playerDirection: 1, //玩家方向 0左 1右     
        mayJump: true, //能否跳跃
        speed: 0, //速度
        hp: 5, //生命值
        time: 0, //时间
        shinState: 0, //攀爬状态 0为不动 1为上爬 2为下滑     
        isAttack: false, //是攻击状态
        whetherSpringback: true, //是否回弹
    },
    playerX: 0, //玩家纵坐标
    playerY: 0, //玩家横坐标

    otherObject: null, //另一个对象，用来保存玩家依附在什么上（是站在地面上还是平台上或者趴着墙上）
    //碰撞开始
    onCollisionEnter: function (other, self) { //处理碰撞的方法
        if (other.node.group == "Ground" || other.node.group == "Platform") { //如果玩家碰到的是节点分组中的地面,或平台
            this.otherObject = other; //获取另一个对象（玩家碰撞的对象）
            if (this.speed < -30) { //如果速度过快
                this.hp = 0; //摔死
            }
            if (self.node.getComponent("Player").playerState == 2 && other.node.y < self.node.y) { //如果玩家状态为下落
                self.node.getComponent("Player").playerState = 0; //玩家状态变为站立
                self.node.y = other.node.y + other.node.height / 2 + 42; //回弹，防止人物脚陷入地面
                if (this.isRun) { //如果是跑动状态
                    if (this.playerDirection == 0) { //如果玩家方向为左
                        this.getComponent(cc.Animation).play("主角左跑动画");
                    } else { //否则，就是玩家方向为右
                        this.getComponent(cc.Animation).play("主角右跑动画");
                    }
                } else { //否则就是玩家不是跑动状态
                    if (this.playerDirection == 0) { //如果玩家方向为左
                        this.getComponent(cc.Animation).play("主角左立动画");
                    } else { //否则，就是玩家方向为右
                        this.getComponent(cc.Animation).play("主角右立动画");
                    }
                }
            } else if (self.node.getComponent("Player").shinState == 2) {
                self.node.getComponent("Player").playerState = 0; //玩家状态变为站立
                if (self.node.getComponent("Player").playerDirection == 0) {
                    self.node.x += 20;
                    this.getComponent(cc.Animation).play("主角左立动画");
                } else {
                    self.node.x -= 20;
                    this.getComponent(cc.Animation).play("主角右立动画");
                }
            }
        } else if (other.node.group == "Wall") { //如果玩家碰到的是节点分组中的墙壁
            if (this.isAttack) { //如果是攻击状态
                this.isRun = false; //停止跑动
                if (this.playerDirection == 0) { //如果人物方向为左
                    this.node.x += 50; //攻击到墙壁往右回弹
                } else { //否则（人物方向为右）
                    this.node.x -= 50; //攻击到墙壁往左回弹
                }
            } else {
                if (self.node.getComponent("Player").playerState == 0) {
                    self.node.y += 20;
                }
                this.node.stopAction(this.wallJump);
                self.node.getComponent("Player").playerState = 3; //玩家状态变为爬墙
                this.isRun = false;
                this.shinState = 0; //攀爬状态为不动
                if (this.playerDirection == 0) { //如果人物方向为左
                    self.node.x = other.node.x + other.node.width / 2 + 25; //回弹，防止人物陷入墙壁
                    this.getComponent(cc.Animation).play("主角左贴动画");
                } else { //否则，就是人物方向为右
                    self.node.x = other.node.x - other.node.width / 2 - 25; //回弹，防止人物陷入墙壁
                    this.getComponent(cc.Animation).play("主角右贴动画");
                }
            }
        } else if (other.node.group == "Pitfall") { //如果玩家碰到的是节点分组中的陷阱
            this.hp = 0;
            this.time = 0;
        } else if (other.node.group == "Save") { //如果玩家碰到的是节点分组中的保存点
            this.playerX = this.node.x;
            this.playerY = this.node.y;
        }
    },

    //碰撞过程中
    onCollisionStay: function (other, self) {
        if (other.node.group == "Lamp") {
            if (this.isAttack) {
                this.mayJump = true;
                this.node.getComponent(cc.BoxCollider).size = cc.size(55, 87); //获取主角的碰撞器，并设置包围盒大小（缩小包围盒，因为攻击到灯后结束攻击人物收刀后碰撞范围变小）
                this.isAttack = false;
                this.time = 0;
            }
        }//else if(){
        //}
    },

    //碰撞结束
    onCollisionExit: function (other, self) {
        if (this.hp > 0) {
            if (other.node.group == "Ground" || other.node.group == "Platform") { //如果玩家与地面或平台碰撞结束
                if (self.node.getComponent("Player").playerState == 0) { //如果玩家状态为站立
                    self.node.getComponent("Player").playerState = 2; //玩家状态变为下落
                    if (this.playerDirection == 0) { //如果玩家方向为左
                        this.getComponent(cc.Animation).play("主角左落动画");
                    } else { //否则，就是玩家方向为右
                        this.getComponent(cc.Animation).play("主角右落动画");
                    }
                }
            } else if (other.node.group == "Wall" && self.node.getComponent("Player").playerState == 3) {
                this.playerState = 1; //玩家状态设为跳
                this.WallGroundJump(); //玩家执行翻跳上地面
                this.speed = 100; //刚起跳时速度快
                this.mayJump = false; //能跳设为false
            }//else if(other.node.group == "Lamp"){
            //     if(this.isAttack){
            //         this.mayJump = true;
            //     }
            // }
        }
    },

    //攻击
    attack() {
        this.isAttack = true; //是攻击状态 
        if (this.playerDirection == 0) { //如果玩家方向为左
            this.getComponent(cc.Animation).play("主角左攻动画");
        } else { //否则
            this.getComponent(cc.Animation).play("主角右攻动画");
        }
        this.node.getComponent(cc.BoxCollider).size = cc.size(140, 87); //获取主角的碰撞器，并设置包围盒大小（扩大包围盒，因为攻击时人物的包围盒要把刀包围进去）
    },

    //左移
    leftMove() {
        this.node.x -= 10
    },

    //右移
    rightMove() {
        this.node.x += 10;
    },

    //攀爬
    shin() {
        if (this.shinState == 1) { //如果人物攀爬状态为上爬
            this.node.y += 3;
        } else if (this.shinState == 2) { //否则，就是人物状态为下滑
            this.node.y -= 9;
        }
    },

    jumpAction: null,
    //跳
    jump() {
        this.jumpAction = cc.moveBy(0.5, cc.v2(0, this.jumpHeight)).easing(cc.easeCubicActionOut());
        this.node.runAction(this.jumpAction);
    },

    jumpDistance: null,
    wallJump: null,
    //爬墙跳
    WallJump() {
        if (this.playerDirection == 0) {
            this.jumpDistance = 200;
        } else {
            this.jumpDistance = -200;
        }
        this.wallJump = cc.moveBy(0.5, cc.v2(this.jumpDistance, this.jumpHeight)).easing(cc.easeCubicActionOut());
        this.node.runAction(this.wallJump);
    },

    //翻跳上地面
    WallGroundJump() {
        if (this.playerDirection == 0) {
            this.jumpDistance = -100;
            this.getComponent(cc.Animation).play("主角左跳动画");
        } else {
            this.jumpDistance = 100;
            this.getComponent(cc.Animation).play("主角右跳动画");
        }
        var WallJump = cc.moveBy(0.25, cc.v2(this.jumpDistance, this.jumpHeight / 2));
        this.node.runAction(WallJump);
    },

    //落下
    drop(speed) {
        this.node.y += speed;
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
    },

    update(dt) {
        if (this.hp == 0) { //如果玩家生命值为0，就是死了     
            if (this.time == 0) {
                this.getComponent(cc.Animation).play("主角爆炸动画");
            }
            if (this.time < 0.4) {
                this.time += dt;
            } else if (this.time >= 0.4) {
                this.node.x = this.playerX;
                this.node.y = this.playerY + 30;
                this.speed = 0;
                this.playerState = 2;
                this.time = 0;
                this.isRun = false;
                this.hp = 5;
            }
        } else { //否则，就是活着
            //this.camera.x = this.node.x; 
            //if (this.camera.x > this.node.x + 100) {
                this.camera.x = this.node.x //+ 100;
            //} else if (this.camera.x < this.node.x - 100) {
                this.camera.x = this.node.x //- 100;
            //}
            if (this.camera.y > this.node.y + 100) {
                this.camera.y = this.node.y + 100;
            } else if (this.camera.y < this.node.y - 100) {
                this.camera.y = this.node.y - 100;
            }

            if (this.isAttack) { //是否是攻击状态
                this.time += dt; //计时
                if (this.time > 0.3) { //当时间大于0.3秒
                    this.node.getComponent(cc.BoxCollider).size = cc.size(55, 87); //获取主角的碰撞器，并设置包围盒大小（缩小包围盒，因为攻击结束人物收刀后碰撞范围变小）
                    this.isAttack = false; //将攻击状态变为false
                    this.time = 0; //时间归零
                    if (this.playerState == 0) { //如果玩家是站立状态
                        if (this.isRun) { //如果玩家是跑动的的
                            if (this.playerDirection == 0) { //如果玩家方向为左
                                this.getComponent(cc.Animation).play("主角左跑动画");
                            } else { //否则（就是玩家方向为右）
                                this.getComponent(cc.Animation).play("主角右跑动画");
                            }
                        } else { //否则（就是站在不动）
                            if (this.playerDirection == 0) { //如果玩家方向为左
                                this.getComponent(cc.Animation).play("主角左立动画");
                            } else { //否则（就是玩家方向为右）
                                this.getComponent(cc.Animation).play("主角右立动画");
                            }
                        }
                    } else { //否则（就是在空中）
                        if (this.playerDirection == 0) { //如果玩家方向为左
                            this.getComponent(cc.Animation).play("主角左落动画");
                        } else { //否则（就是玩家方向为右）
                            this.getComponent(cc.Animation).play("主角右落动画");
                        }
                    }
                }
            }

            if (this.isRun) { //如果能跑动
                if (this.playerDirection == 0) { //如果玩家方向是左
                    this.leftMove(); //向左跑
                } else { //否则
                    this.rightMove(); //向右跑
                }
            }

            if (this.playerState == 0) { //如果玩家状态为站立
                this.speed = 0; //速度归零
                this.mayJump = true; //能跳跃
            } else if (this.playerState == 1) { //如果玩家状态为跳
                this.speed -= dt * 400; //速度越来越慢
                if (this.speed <= 0) { //如果速度减少到小于等于0
                    this.speed = 0; //速度归零
                    this.node.stopAction(this.jumpAction); //停止跳
                    this.playerState = 2; //玩家状态变为下落
                }
            } else if (this.playerState == 2) { //如果玩家状态为下落
                this.speed -= dt * 30; //下落状态下速度随时间变得越来越快
                this.drop(this.speed); //执行下落
            } else if (this.playerState == 3) { //如果玩家状态为爬墙
                this.speed = 0; //速度归零
                this.mayJump = true; //能跳跃
                this.shin(); //攀爬
            }
        }
    },
});
