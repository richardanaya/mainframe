var Pickup = function(player,obj){
    this.player = player;
    this.obj = obj;
};

Pickup.prototype = Object.create(Action.prototype);

Pickup.prototype.process = function(complete){
    if(!this.isObjectStillInPlay(this.obj)){ complete();return; }

    if(this.obj.id == "hackable_safe"){
        var _this = this;
        var programs = [];
        var items = this.player.getInventoryWithTag("program");
        for(var i = 0 ; i < items.length ; i++){
            if(items[i].equipped){
                programs.push(Pickupable.Items[items[i].id].program_name);
            }
        }
        var music = this.player.level.scene.music;
        music.fade(1,0,3000,function(){
            music.stop();
        });
        this.player.level.scene.game.changeScene(new HackScene(this.game, this.scene, 1, programs, function(result){
            music.play();
            music.fade(0,1,3000);
            _this.player.level.scene.game.changeScene(_this.player.level.scene);
            complete();
        }));
        return;
    }

    this.obj.level.removeObject(this.obj);
    this.obj.onPickup(this.player);
    this.player.addToInventory(this.obj);
    this.obj.level.scene.showInfoText("You picked up "+this.obj.name);
    complete();
};