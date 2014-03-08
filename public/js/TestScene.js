var TestScene = function(game){
    this.game = game;
    this.infoText = [];
    this.time = 0;
    this.player = new Player();
    this.currentHeight = 1000
    this.mode = "play";
    this.showInfoText("You awake");
    this.size = 64;

    this.viewTranslateX = 0;
    this.viewTranslateY = 0;
    this.viewScaleX = 1;
    this.viewScaleY = 1;

    var _this = this;
    Hammer($('#screen').get(0)).on("dragstart", function(e) {
        _this.viewTranslateStartX = _this.viewTranslateX;
        _this.viewTranslateStartY = _this.viewTranslateY;
    });

    $('#screen').on('mousewheel', function(event) {
        var scaleStep = 1.5;
        var x = event.offsetX;
        var y = event.offsetY;
        if(event.deltaY>0){

            var mx = Math.floor((x-_this.viewTranslateX)/_this.viewScaleX);
            var my = Math.floor((y-_this.viewTranslateY)/_this.viewScaleY);
            _this.viewScaleX *= scaleStep;
            _this.viewScaleY *= scaleStep;
            var mxpost = Math.floor((x-_this.viewTranslateX)/_this.viewScaleX);
            var mypost = Math.floor((y-_this.viewTranslateY)/_this.viewScaleY);
            _this.viewTranslateX -= (mx-mxpost)*_this.viewScaleX;
            _this.viewTranslateY -= (my-mypost)*_this.viewScaleY;
        }
        else {
            var mx = Math.floor((x-_this.viewTranslateX)/_this.viewScaleX);
            var my = Math.floor((y-_this.viewTranslateY)/_this.viewScaleY);
            _this.viewScaleX /=scaleStep;
            _this.viewScaleY /=scaleStep;
            var mxpost = Math.floor((x-_this.viewTranslateX)/_this.viewScaleX);
            var mypost = Math.floor((y-_this.viewTranslateY)/_this.viewScaleY);
            _this.viewTranslateX -= (mx-mxpost)*_this.viewScaleX;
            _this.viewTranslateY -= (my-mypost)*_this.viewScaleY;
        }
    });

    Hammer($('#screen').get(0)).on("drag", function(e) {
        _this.viewTranslateX = _this.viewTranslateStartX+e.gesture.deltaX;
        _this.viewTranslateY = _this.viewTranslateStartY+e.gesture.deltaY;
    });

    this.pickupButton = new Button(this,0,100);
    this.pickupButton.visible = false;
    this.attackButton = new Button(this,0,220,"red");
    this.attackButton.visible = false;
    this.inventoryButton = new Button(this,0,0);
    this.inventoryButton.image = Resources.getImage("inventory");
    this.rangedButton = new Button(this,0,0);
    if(this.player.rangedWeapon){
        this.rangedButton.image = this.player.rangedWeapon.image;
    }
    this.cancelButton = new Button(this,0,0);
    this.cancelButton.image = Resources.getImage("cancel");

    this.inventoryDialog = new InventoryDialog(this);
    this.inventoryDialog.scene = this;
    this.effects = [];
    this.loadLevel(this.currentHeight)
};

TestScene.prototype = Object.create(Scene.prototype);

TestScene.prototype.loadLevel = function(height){
    this.effects = [];
    var _this = this;
    if(_this.music){
        _this.music.fade(1,0,3000);
    }

    var done = function(){
        _this.game.changeScene(_this);
        _this.player.stopAutoMove();
        _this.level = _this.game.GetLevel(height);

        _this.level.addObjectTo( _this.level.center.x, _this.level.center.y, _this.player );
        _this.player.explore();
        _this.level.refreshLights( [_this.player.light] );

        _this.centerViewAroundPlayer();
        _this.level.scene = _this;
        _this.currentHeight = height;


        if(height == 1000){
            _this.music = new Howl({
                urls: ['sounds/rain.mp3'],
                loop: true
            }).play();
            _this.music.fade(0,1,3000);
            if(Flags.flag("intro")){
                _this.showDialog("You wake up to the sound of rain.  What happened? You feel a burning at the ache of your neck. You reach back and find blood at your neckport, but you cannot recall any memory how you arrived to the top of _this building.",_this.player.image_idle_0,_this.player.image_idle_1)
            }
        }
        else {
            _this.music = new Howl({
                urls: ['sounds/Corporate1.mp3'],
                loop: true
            }).play();
            _this.music.fade(0,1,3000);
            _this.music = null;
        }
    }

    if(height == 1000){
        done();
    }
    else {
        this.game.changeScene(new ElevatorScene(this.game,done,this.currentHeight,height,this.player.image_idle_0))
    }
};

TestScene.prototype.centerViewAroundPlayer = function(){
    this.centerViewAroundSquare(this.player.x,this.player.y);
}

TestScene.prototype.centerViewAroundSquare = function(x,y){
    this.viewTranslateX = (-x*this.size-this.size/2)*this.viewScaleX+window.innerWidth/2;
    this.viewTranslateY = (-y*this.size-this.size/2)*this.viewScaleY+window.innerHeight/2;
}

TestScene.prototype.getTileToScreen = function(tileX,tileY){
    return {
        x: tileX*this.size*this.viewScaleX+this.viewTranslateX,
        y: tileY*this.size*this.viewScaleY+this.viewTranslateY
    };
}

TestScene.prototype.update = function(delta){
    this.level.update();

    this.time += delta;

    if(this.currentHeight == 1000){
        var bg = Resources.getImage("CityScapebg");
        this.ctx.drawImage(bg,0,0,window.innerWidth,window.innerHeight);
    }

    this.ctx.save();
    this.ctx.translate(this.viewTranslateX,this.viewTranslateY);
    this.ctx.scale(this.viewScaleX,this.viewScaleY);
    for(var x = 0; x < this.level.width; x++){
        for(var y = 0; y < this.level.width; y++){
            var t = this.level.tiles[this.level.width*y+x];
			if( t != null && t != undefined && t.image != undefined && t.image != null && t.explored ) {
            	this.ctx.drawImage(t.image,x*this.size ,y*this.size,this.size ,this.size  );
                this.ctx.globalAlpha = Math.max( 0.7-t.brightness, 0.3 );
                this.ctx.drawImage(Resources.getImage('fowoverlay'),x*this.size ,y*this.size,this.size ,this.size  );
                this.ctx.globalAlpha = 1;

            	for(var i = 0 ; i < t.objects.length; i++){
            	    var o = t.objects[i];
            	    o.update(delta);
            	    this.ctx.save();
            	    if(o.flipped){
            	        this.ctx.translate(this.size* o.x+this.size,this.size* o.y);
            	        this.ctx.scale(-this.size,this.size);
            	    }
            	    else {
            	        this.ctx.translate(this.size* o.x,this.size* o.y);
            	        this.ctx.scale(this.size,this.size);
            	    }
            	    this.ctx.drawImage(o.image,0,0,1,1);
            	    this.ctx.restore();
				}
            }
        }
    }
    this.ctx.restore();

    if(this.currentHeight == 1000){

        var r0 = Resources.getImage("rain_0");
        var r1 = Resources.getImage("rain_1");
        var r2 = Resources.getImage("rain_2");

        this.ctx.globalAlpha = .2;
        var r = this.time*2-Math.floor(this.time*2);
        for(var x = 0; x < Math.ceil(window.innerWidth/256);x++){
            for(var y = 0; y < Math.ceil(window.innerHeight/256);y++){

                if(r<.33){
                    this.ctx.drawImage(r0,x*256,y*256,256,256);
                }
                else if(r<.66){
                    this.ctx.drawImage(r1,x*256,y*256,256,256);
                }
                else {
                    this.ctx.drawImage(r2,x*256,y*256,256,256);
                }
            }
        }

    }
    this.ctx.globalAlpha = 1;

    for(var i = 0 ; i < this.effects.length; i++){
        this.effects[i].update(delta);
    }

    this.pickupButton.update(delta);
    this.pickupButton.render();
    this.pickupButton.x = this.width-this.attackButton.width-10;
    this.attackButton.update(delta);
    this.attackButton.render();
    this.attackButton.x = this.width-this.attackButton.width-10;
    this.inventoryButton.x = this.width-this.attackButton.width-10;
    this.inventoryButton.y = this.height-this.attackButton.height-50;
    this.inventoryButton.render();

    this.rangedButton.x = this.width-this.attackButton.width-10;
    this.rangedButton.y = this.height-this.attackButton.height-160;
    this.rangedButton.render();

    if(this.mode == "select"){
        this.cancelButton.x = this.width-this.attackButton.width-10;
        this.cancelButton.y = this.height-this.attackButton.height-270;
        this.cancelButton.render();
    }



    this.ctx.font = "16px 'Press Start 2P'";
    this.ctx.fillStyle = "white";

    this.ctx.fillText("HP",25,40)
    var hp = Resources.getImage("hp");
    var hp_frame_left = Resources.getImage("hp_frame_left");
    var hp_frame_middle = Resources.getImage("hp_frame_middle");
    var hp_frame_right = Resources.getImage("hp_frame_right");
    var hx = 65;
    var hy = 10;
    this.ctx.drawImage(hp_frame_left, hx,hy,14,40);
    this.ctx.drawImage(hp_frame_middle, hx+14,hy,200,40);
    this.ctx.drawImage(hp_frame_right, hx+14+200,hy,14,40);
    this.ctx.drawImage(hp, hx+14,hy+12,200*this.player.health/this.player.maxHealth,14);



    for(var i = 0 ; i < this.infoText.length ; i++){
        this.ctx.fillText(this.infoText[i].text,10, this.height-20*i-15);
    }

    if(this.mode == "dialog"){
        this.dialog.update(delta);
        this.dialog.render();
    }

    if(this.mode == "inventory"){
        this.inventoryDialog.update(delta);
        this.inventoryDialog.render();
    }
};

TestScene.prototype.processAllMoves = function(){
    var moves = [];
    for(var i = 0 ; i < this.level.allObjects.length; i++){
        if(this.level.allObjects[i].thinks){
            moves = moves.concat(this.level.allObjects[i].think());
        }
    }
    var _this = this;

    var i = 0;
    var process = function(i){
        if(i>= moves.length){
            //When done
            _this.centerViewAroundPlayer();
            var options_changed = _this.listOptions();
            this.graph = _this.level.getGraph();
            if(_this.player.autoMove() && !options_changed){
                setTimeout(function(){
                    _this.processAllMoves();
                },100);
            }
            return;
        }
        moves[i].process(function(){process(i+1);});
    }
    process(0);
}


TestScene.prototype.listOptions = function(){
    var options_changed = false;
    var pickup_targets = this.level.getObjectsByTypeOnTile(this.player.x,this.player.y,"item");
    if(pickup_targets.length>0){
        if(pickup_targets[0].id && Pickupable.Items[pickup_targets[0].id].floor_name){
            this.showInfoText("You are standing by a "+Pickupable.Items[pickup_targets[0].id].floor_name);
        }
        else {
            this.showInfoText("You are standing by something");
        }

        if(this.pickup_target != pickup_targets[0]){ options_changed = true;}
        this.pickup_target = pickup_targets[pickup_targets.length-1];
        this.pickupButton.image = this.pickup_target.image;
        this.pickupButton.show();
    }
    else {
        this.pickupButton.hide();
        this.pickup_target = null;
    }
    var attack_targets = this.level.getNeighborObjectsByType(this.player.x,this.player.y,"monster");
    if(attack_targets.length>0){
        if(this.attack_target != attack_targets[0]){ options_changed = true;}
        this.attack_target = attack_targets[0];
        this.attackButton.image = this.attack_target.image;
        this.attackButton.show();
    }
    else {
        this.attackButton.hide();
        this.attack_target = null;
    }
    return options_changed;
}


TestScene.prototype.onKeyDown = function(key){
    if(this.mode == "play"){
        this.graph = this.level.getGraph();
        if(key == 37 || key == 65){
            this.player.moveLeft();
        }
        else if(key == 38 || key == 87){
            this.player.moveUp();
        }
        else if(key == 39 || key == 68){
            this.player.moveRight();
        }
        else if(key == 40 || key == 83){
            this.player.moveDown();
        }
        else if(key == 32){
            if (this.attack_target){
                this.attackNearestTarget();
            }
            else if(this.pickup_target){
                this.pickupNearestTarget();
            }
        }
        this.processAllMoves();
    }
    else if(this.mode == "dialog"){
        this.mode = "play";
    }
    else if(this.mode == "inventory"){
        this.mode = "play";
    }
    else if(this.mode == "select"){
        this.onselect(-1,-1,null);
        this.mode = "play";
        return;
    }
};


TestScene.prototype.onTap = function(x,y){
    if(this.mode == "play"){
        this.graph = this.level.getGraph();
        var moveToX = Math.floor((x-this.viewTranslateX)/this.viewScaleX/this.size);
        var moveToY = Math.floor((y-this.viewTranslateY)/this.viewScaleY/this.size);


        if(this.pickup_target){
            if(this.pickupButton.isWithin(x,y)){
                this.player.pickup(this.pickup_target);
                this.processAllMoves();
                return;
            }
        }

        if(this.attack_target){
            if(this.attackButton.isWithin(x,y)){
                this.attackNearestTarget();
                return;
            }
        }

        if(this.inventoryButton.isWithin(x,y)){
            if(this.inventoryDialog.visible){
                this.inventoryDialog.hide();
                this.mode = "play";
                return;
            }
            else {
                this.mode = "inventory";
                this.inventoryDialog.show();
                return;
            }
        }

        var _this = this;
        if(this.rangedButton.isWithin(x,y)){
            if(this.player.rangedWeapon){
                this.showInfoText("Tap on what you would like to shoot.")
                this.select(function(x,y,obj){
                    if(x!=-1&&y!=-1){
                        _this.player.rangeAttackTarget(x,y,obj);
                    }
                });
            }
            return;
        }

        if(this.level.isPointWithin(moveToX,moveToY)){
            this.player.autoMoveTo(Math.floor(moveToX),Math.floor(moveToY));
            this.player.autoMove();
            this.processAllMoves();
            return;
        }
    }
    else if(this.mode == "dialog"){
        this.mode = "play";
        if(this.dialogComplete){
            this.dialogComplete();
        }
    }
    else if(this.mode == "inventory"){
        if(this.inventoryButton.isWithin(x,y)){
            if(this.inventoryDialog.visible){
                this.inventoryDialog.hide();
                this.mode = "play";
            }
        }
        this.inventoryDialog.onTap(x,y);
    }
    else if(this.mode == "select"){
        if(this.cancelButton.isWithin(x,y)){
            this.mode = "play";
            return;
        }

        var tileX = Math.floor((x-this.viewTranslateX)/this.viewScaleX/this.size);
        var tileY = Math.floor((y-this.viewTranslateY)/this.viewScaleY/this.size);
        var objs = this.level.getTileAt(tileX,tileY);
        this.onselect(tileX,tileY,objs);
        this.mode = "play";
        return;
    }
}

TestScene.prototype.attackNearestTarget = function(){
    if(this.attack_target){
        this.player.attack(this.attack_target);
        this.processAllMoves();
    }
}

TestScene.prototype.pickupNearestTarget = function(){
    this.player.pickup(this.pickup_target);
    this.processAllMoves();
    return;
}

TestScene.prototype.select = function(onselect){
    this.onselect = onselect;
    this.mode = "select";
}

TestScene.prototype.onDie = function(){
    this.showInfoText("You Died");
    this.game.changeScene(new StartScene(this.game));
    this.mode = "dead";
    this.music.fadeOut(1,0,3000);
}

TestScene.prototype.showDialog = function(text, img0, img1, onComplete){
    this.mode = "dialog";
    this.dialog = new Dialog(this,text.toUpperCase());
    this.dialog.image = img0;
    this.dialog.imageAnim = img1;
    this.dialog.show();
    this.dialog.scene = this;
    this.dialogComplete = onComplete;
}


TestScene.prototype.showInfoText = function(text){
    this.infoText.push({text:text.toUpperCase(),time:this.time});
    if(this.infoText.length > 3){
        this.infoText.splice(0,1);
    }
}
