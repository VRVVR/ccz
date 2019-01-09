// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var Virtual4Key = require('Virtual4Key');

cc.Class({
    extends: cc.Component,

    properties: {
        v4key: Virtual4Key,
    },
    start () {
        this.v4key.addListener('press',(keyName)=>{
            this.getComponent(cc.Label).string = 'press ' + keyName;
        });
        this.v4key.addListener('release',(keyName)=>{
            this.getComponent(cc.Label).string = 'release ' + keyName;
        })
    },

});
