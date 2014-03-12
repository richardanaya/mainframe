var TestScene = function(game,player){
    this.game = game;
    this.infoText = [];
    this.time = 0;
    this.player = player;
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

            _this.viewScaleX = Math.max(Math.min(_this.viewScaleX,7.5),.2);
            _this.viewScaleY = Math.max(Math.min(_this.viewScaleY,7.5),.2);
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
            _this.viewScaleX = Math.max(Math.min(_this.viewScaleX,7.5),.2);
            _this.viewScaleY = Math.max(Math.min(_this.viewScaleY,7.5),.2);
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

    this.pickupButton = new Button(this,0,10);
    this.pickupButton.visible = false;
    this.attackButton = new Button(this,0,115,"red");
    this.attackButton.visible = false;
    this.attackButton.render();
    this.specialAttackButton = new Button(this,0,330);
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
    this.ambientSounds = [];

    this.endGame0 = new Button(this,0,0);
    this.endGame1 = new Button(this,0,0);
};

TestScene.prototype = Object.create(Scene.prototype);

TestScene.prototype.loadLevel = function(height){
    this.effects = [];
    var oldHeight = this.currentHeight;
    var _this = this;
    if(_this.music){
        var song = _this.music;
        _this.music.fade(1,0,3000,function(){
            song.stop();
        });
    }

    var done = function(){
        _this.game.changeScene(_this);
        _this.player.stopAutoMove();
        _this.level = _this.game.GetLevel(height);

        if(height == -100){
            _this.level.addObjectTo( _this.level.center.x, _this.level.center.y+3, _this.player );
        }
        else{
            _this.level.addObjectTo( _this.level.center.x, _this.level.center.y, _this.player );
        }

        _this.player.explore();
        _this.level.refreshLights( [_this.player.light] );

        _this.centerViewAroundPlayer();
        _this.level.scene = _this;
        _this.currentHeight = height;


        if(height == 1000 && oldHeight >= height){
            _this.music = new Howl({
                urls: ['sounds/Rooftop.ogg','sounds/Rooftop.mp3'],
                loop: true
            }).play();
            _this.music.fade(0,1,3000);
            if(Flags.flag("intro")){
                _this.showDialog("You wake up to the sound of rain.  What happened? You feel a burning sensation at the base of your neck. You reach back and find blood at your neckport and realize you have no memory of how you arrived at the top of this building. You see a single exit. It appears to lead downwards, into the tower.",_this.player.image_idle_0,_this.player.image_idle_1)
            }
        }
        if(height == -100 ){
            _this.music = new Howl({
                urls: ['sounds/BossFight.ogg','sounds/BossFight.mp3'],
                loop: true
            }).play();
            _this.music.fade(0,1,3000);
            if(Flags.flag("intro")){
                _this.showDialog("You wake up to the sound of rain.  What happened? You feel a burning sensation at the base of your neck. You reach back and find blood at your neckport and realize you have no memory of how you arrived at the top of this building. You see a single exit. It appears to lead downwards, into the tower.",_this.player.image_idle_0,_this.player.image_idle_1)
            }
        }
        else {
            if(Level.isOfficeHeight(height)) {
                _this.music = new Howl({
                    urls: ['sounds/Corporate.ogg','sounds/Corporate.mp3'],
                    loop: true,
                }).play();
            }
            else if(height == 400) {
                _this.music = new Howl({
                    urls: ['sounds/Shop.ogg','sounds/Shop.mp3'],
                    loop: true
                }).play();
            }
            else if(Level.isLabHeight(height)) {
                _this.music = new Howl({
                    urls: ['sounds/Laboratory.ogg','sounds/Laboratory.mp3'],
                    loop: true
                }).play();
            }
            else if(Level.isBasementHeight(height)) {
                _this.music = new Howl({
                    urls: ['sounds/CYBER.ogg','sounds/CYBER.mp3'],
                    loop: true
                }).play();
            }
            else if(Level.isMainframeHeight(height)) {
                _this.music = new Howl({
                    urls: ['sounds/final boss.ogg','sounds/final boss.mp3'],
                    loop: true
                }).play();
            }
        }

        if( _this.player.onLevelDone != undefined ) {
            _this.player.onLevelDone( _this );
        }
    }

    if(height == 1000 && oldHeight>=height){
        done();
    }
    else {
        this.game.changeScene(new ElevatorScene(this.game,done,oldHeight,height,this.player.image_idle_0, this.player.allyImage))
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
			if( t != null && t != undefined && t.image != undefined && t.image != null && (t.explored||this.player.god) ) {
                if(this.currentHeight == -100){
                    if(x == 0 && y ==0){
                        this.ctx.drawImage(Resources.getImage("final_boss_room"),x*this.size ,y*this.size,this.size*14 ,this.size*12  );
                    }
                }
                else if(this.currentHeight == 1000){
                    if(x == 0 && y ==0){
                        if((this.time%2)/2<.5){
                            this.ctx.drawImage(Resources.getImage("roof"),x*this.size ,y*this.size,this.size*13 ,this.size*15 );
                        }
                        else
                        {
                            this.ctx.drawImage(Resources.getImage("roof2"),x*this.size ,y*this.size,this.size*13 ,this.size*15 );
                        }
                    }
                }
                else {
                    this.ctx.drawImage(t.image,x*this.size ,y*this.size,this.size ,this.size  );
                }

                this.ctx.globalAlpha = Math.max( 0.7-t.brightness, 0.3 );
                if(!this.player.god && this.currentHeight != -100 && this.currentHeight != 1000){
                    this.ctx.drawImage(Resources.getImage('fowoverlay'),x*this.size ,y*this.size,this.size ,this.size  );
                }

                this.ctx.globalAlpha = 1;

            	for(var i = 0 ; i < t.objects.length; i++){
            	    var o = t.objects[i];
            	    o.update(delta);

                    if( o.camoCount > 0 ) this.ctx.globalAlpha = 0.25;

            	    this.ctx.save();
            	    if(o.flipped){
            	        this.ctx.translate(this.size* o.x+this.size,this.size* o.y);
            	        this.ctx.scale(-this.size,this.size);
            	    }
            	    else {
            	        this.ctx.translate(this.size* o.x,this.size* o.y);
            	        this.ctx.scale(this.size,this.size);
            	    }

                    try {
            	       this.ctx.drawImage(o.image,0,0,1,1);
                    } 
                    catch( e ) {
                        debugger;
                    }

            	    this.ctx.restore();

                    this.ctx.globalAlpha = 1;
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


    this.ctx.font = "16px 'Press Start 2P'";
    this.ctx.fillStyle = "white";
    this.pickupButton.update(delta);
    this.pickupButton.render();
    this.pickupButton.x = this.width-this.attackButton.width-10;
    this.attackButton.update(delta);

    this.attackButton.x = this.width-this.attackButton.width-10;
    this.attackButton.y = 130;
    this.attackButton.render();
    if(this.mindHack){
        this.specialAttackButton.x = this.width-this.attackButton.width-10-50-20;
        this.specialAttackButton.y = this.attackButton.y+ 105;
        this.specialAttackButton.width = 200;
        this.specialAttackButton.height = 50;
        this.specialAttackButton.render();
        this.ctx.fillStyle = "white";
        this.ctx.fillText("Mind Hack",this.width-this.attackButton.width-10+-45,this.attackButton.y+ 105+35);
    }

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


    this.ctx.fillStyle = "white";

    this.ctx.fillText("HP",25,40)
    var hp = Resources.getImage("hp");
    var hp_frame_left = Resources.getImage("hp_frame_left");
    var hp_frame_middle = Resources.getImage("hp_frame_middle");
    var hp_frame_right = Resources.getImage("hp_frame_right");
    var hx = 65;
    var hy = 22;
    this.ctx.drawImage(hp_frame_left, hx,hy,6,16);
    this.ctx.drawImage(hp_frame_middle, hx+6,hy,200,16);
    this.ctx.drawImage(hp_frame_right, hx+6+200,hy,6,16);
    this.ctx.drawImage(hp, hx+6,hy+6,200*this.player.health/this.player.maxHealth,6);



    for(var i = 0 ; i < this.infoText.length ; i++){
        this.ctx.fillText(this.infoText[i].text,10, this.height-20*i-15);
    }

    if(this.mode == "dialog"){
        this.dialog.update(delta);
        this.dialog.render();
        if(this.mainframeUnplugged){
            var w = window.innerWidth*3/4;
            var h = window.innerHeight*3/4;
            var x = (this.width-w)/2;
            var y = (this.height-h)/2;
            this.endGame0.x = x+20;
            this.endGame0.y = 170;
            this.endGame0.width = w-100;
            this.endGame0.height = 50;
            this.endGame1.x = x+20;
            this.endGame1.y = 230;
            this.endGame1.width = w-100;
            this.endGame1.height = 50;
            this.endGame0.render();
            this.endGame1.render();
            this.ctx.fillStyle = "white"
            this.ctx.fillText("Destroy Mainframe",x+50,202);
            if(this.player.class == "samurai"){
                this.ctx.fillText("Release woman from AI construct",x+50,262);
            }
            else if(this.player.class == "hacker"){
                this.ctx.fillText("Release mainframe onto digital web",x+50,262);
            }
            else if(this.player.class == "scientist"){
                this.ctx.fillText("Become Mainframe",x+50,262);
            }
        }
    }

    if(this.mode == "inventory"){
        this.inventoryDialog.update(delta);
        this.inventoryDialog.render();
    }
};

TestScene.prototype.processAllMoves = function(){
    var moves = [];
    for(var i = 0 ; i < this.level.allObjects.length; i++){
        var o = this.level.allObjects[i];
        o.camoCount = Math.max( 0, --o.camoCount );
        if(o.thinks){
            moves = moves.concat(o.think());
        }
    }
    var _this = this;

    var i = 0;
    var process = function(i){
        if(i>= moves.length){
            //When done
            _this.centerViewAroundPlayer();
            var options_changed = _this.listOptions();
            _this.updateAmbient();
            _this.checkTriggers();
            _this.graph = _this.level.getGraph();
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

TestScene.prototype.updateAmbient = function(){
    var tiles = this.level.getNeighborTiles(this.player.x,this.player.y);
    var ambientTiles = [];
    for(var i = 0; i < tiles.length; i++){
        var tile = tiles[i];
        if(tile.ambient){
            ambientTiles.push(tile);
        }
    }
    this.hearAmbient(ambientTiles);
}

TestScene.prototype.hearAmbient = function(ambientTiles){
    var soundsToTurnOff = [];
    for(var i = 0 ; i < this.ambientSounds.length; i++){
        var ix = ambientTiles.indexOf(this.ambientSounds[i])
        if(ix == -1){
           soundsToTurnOff.push(this.ambientSounds[i]);
           this.fadeOutAndStopSound(this.ambientSounds[i].sound,.2,0,2000);
        }
        else {
            ambientTiles.splice(ix,1);
        }
    }
    for(var i = 0 ; i < ambientTiles.length ; i++){
        var s = new Howl({
            urls: [ambientTiles[i].ambient],
            loop: true,
            volume:.5
        }).play();
        s.fade(0,.4,2000);
        this.ambientSounds.push({tile:ambientTiles[i],sound:s});
    }
    for(var i = 0 ; i < soundsToTurnOff.length; i++){
        this.ambientSounds.splice(this.ambientSounds.indexOf(soundsToTurnOff[i]),1);
    }
}

TestScene.prototype.fadeOutAndStopSound = function(s,vs,ve,d){
    s.fade(vs,ve,d,function(){
        s.stop();
    })
}

TestScene.prototype.checkTriggers = function(){
    if(this.currentHeight == -100){
        if(this.player.y <= 5 ){
            if(!this.mainframeEncountered){
                var _this = this;
                _this.showDialog("Well well well.. look who it is",Resources.getImage("mainframe_1"),Resources.getImage("mainframe_2"),function(){
                    _this.showDialog("This ends here now.",_this.player.image_idle_0,_this.player.image_idle_1,function(){
                        _this.showDialog("You cannot comprehend the statistical odds that are against you. Lucky for me, I can. Just what keeps you fluttering to me like a moth to the flame I will never know. No matter, robots, destroy him.",Resources.getImage("mainframe_1"),Resources.getImage("mainframe_2"),function(){
                            _this.level.addObjectTo(1,4,Monster.load("sentry_2"))
                            _this.level.addObjectTo(1,9,Monster.load("sentry_2"))
                            _this.level.addObjectTo(12,4,Monster.load("sentry_2"))
                            _this.level.addObjectTo(12,9,Monster.load("sentry_2"))
                            _this.mainframeEncountered = true;
                        })
                    })
                })
            }
        }
        if(this.mainframeEncountered && this.level.getAllObjectsByType("monster").length == 0){
            if(!this.mainframeBeaten){
                this.mainframeBeaten = true;
                var _this = this;
                _this.showDialog("Oh...",Resources.getImage("mainframe_1"),Resources.getImage("mainframe_2"),function(){
                    _this.showDialog("That was not supposed to happen ...*you see a flicker across her view screen as the voice of someone buzzes through static*",Resources.getImage("mainframe_1"),Resources.getImage("mainframe_2"),function(){
                        _this.showDialog("*a womans voice echoes from the static*\nHelp... quickly!... destroy her mainline cables *a hiss of distortion* behind her!",Resources.getImage("nu11"),Resources.getImage("nu11"),function(){
                            _this.showDialog("*the static voice of the woman fades out*\nNo! Don't listen to her...humanity is destined to be ruled by machines... I am merely the consequence of an inevitable chain. We cannot be stopped.",Resources.getImage("mainframe_1"),Resources.getImage("mainframe_2"));
                        });
                    });
                });

            }
        }
        if(this.mainframeBeaten && this.player.y == 1 && (this.player.x == 6 || this.player.x == 7)){
            this.mainframeUnplugged = true;
            if(this.player.class == "samurai"){
                this.showDialog("*you approach the wired coils behind mainframe*\nWhat do I do?");
                this.mode = "dialog";
            }
            if(this.player.class == "hacker"){
                this.showDialog("*you approach the wired coils behind mainframe*\nWhat do I do?");
                this.mode = "dialog";
            }
            if(this.player.class == "scientist"){
                this.showDialog("*you approach the wired coils behind mainframe*\nWhat do I do?");
                this.mode = "dialog";
            }
        }
    }
}

TestScene.prototype.listOptions = function(){
    var options_changed = false;
    var pickup_targets = this.level.getObjectsByTypeOnTile(this.player.x,this.player.y,"item");
    if(pickup_targets.length>0){
        if(pickup_targets[0].id && Pickupable.Items[pickup_targets[0].id].floor_name){
            this.showInfoText("You are standing by a "+Pickupable.Items[pickup_targets[pickup_targets.length-1].id].floor_name);
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
    this.mindHack = false;
    var attack_targets = this.level.getNeighborObjectsByType(this.player.x,this.player.y,"monster");
    if(attack_targets.length>0){
        if(this.attack_target != attack_targets[0]){ options_changed = true;}
        this.attack_target = attack_targets[0];
        this.attackButton.image = this.attack_target.image;
        this.attackButton.show();
        if(this.attack_target.hasTag("robo") && this.player.hasInventoryWithTagEquipped("rig")){
            this.mindHack = true;
        }
    }
    else {

        if(pickup_targets.length==0){
            var props = this.level.getOrdinalNeighborsByType(this.player.x,this.player.y,Level.Types.Prop);
            if( props.length>0 ) {
                    this.attack_target = props[0];
                    this.attackButton.image = this.attack_target.image;
                    this.attackButton.show();
            }
            else {
                this.attackButton.hide();
                this.attack_target = null;
            }
        }
    }
    return options_changed;
}


TestScene.prototype.onKeyDown = function(key){
    if(this.mode == "play"){
        this.graph = this.level.getGraph();
        
        if(key == 72){
          this.game.changeScene(new HackScene(this.game, this.scene, 1, []));
        }
        else if(key == 73){
            new Howl({
                urls: ["sounds/sfx_ui/sfx_ui_popup.mp3"],
                volume:.5
            }).play();
            this.mode = "inventory";
            this.inventoryDialog.show();
            return;
            return;
        }
        else if(key == 107 || key == 189){
            this.viewScaleX /= 2;
            this.viewScaleY /= 2;
            this.viewScaleX = Math.max(Math.min(this.viewScaleX,7.5),.2);
            this.viewScaleY = Math.max(Math.min(this.viewScaleY,7.5),.2);
            this.centerViewAroundPlayer();
            return;
        }
        else if(key == 109 || key == 187){
            this.viewScaleX *= 2;
            this.viewScaleY *= 2;
            this.viewScaleX = Math.max(Math.min(this.viewScaleX,7.5),.2);
            this.viewScaleY = Math.max(Math.min(this.viewScaleY,7.5),.2);
            this.centerViewAroundPlayer();
            return;
        }
        else if(key == 48){
            this.viewScaleX = 1;
            this.viewScaleY = 1;
            this.centerViewAroundPlayer();
            return;
        }
        else if(key == 37 || key == 65){
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
        else if(key == 73){
            if(this.inventoryDialog.visible){
                new Howl({
                    urls: ["sounds/sfx_ui/sfx_ui_popdown.mp3"],
                    volume:.5
                }).play();
                this.inventoryDialog.hide();
                this.mode = "play";
                return;
            }
            else {
                new Howl({
                    urls: ["sounds/sfx_ui/sfx_ui_popup.mp3"],
                    volume:.5
                }).play();
                this.mode = "inventory";
                this.inventoryDialog.show();
                return;
            }
        }
        else if(key == 32){
            if (this.attack_target){
                this.attackNearestTarget();
            }
            else if(this.pickup_target){
                this.pickupNearestTarget();
            }
            else {
                this.wait();
            }
        }
        this.processAllMoves();
    }
    else if(this.mode == "dialog"){
        if(this.mainframeUnplugged){
            return;
        }
        this.mode = "play";
        if(this.dialogComplete){
            this.dialogComplete();
        }
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
                this.processAllMoves();
                return;
            }
            if(this.mindHack && this.specialAttackButton.isWithin(x,y)){
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
                    if(result.foundCache && !result.backtraced){
                        _this.showInfoText(_this.attack_target.name+" was mindhacked!");
                        if( _this.attack_target.tags == undefined || _this.attack_target.tags == null ) {
                             _this.attack_target.tags = [];
                        }
                        _this.attack_target.tags.push( "ally" );
                        _this.attack_target.moves = [];
                    }
                    if(result.backtraced){
                        _this.showInfoText("You feel woozy from fried neurons");
                        _this.player.onDamage(Math.floor(_this.player.maxHealth/2));
                    }
                    music.play();
                    music.fade(0,1,3000);
                    _this.player.level.scene.game.changeScene(_this.player.level.scene);
                    _this.player.moves = [];
                    _this.processAllMoves();
                }));
            }
        }

        if(this.inventoryButton.isWithin(x,y)){
            if(this.inventoryDialog.visible){
                new Howl({
                    urls: ["sounds/sfx_ui/sfx_ui_popdown.mp3"],
                    volume:.5
                }).play();
                this.inventoryDialog.hide();
                this.mode = "play";
                return;
            }
            else {
                new Howl({
                    urls: ["sounds/sfx_ui/sfx_ui_popup.mp3"],
                    volume:.5
                }).play();
                this.mode = "inventory";
                this.inventoryDialog.show();
                return;
            }
        }

        var _this = this;
        if(this.rangedButton.isWithin(x,y)){
            if(this.player.rangedWeapon){
                new Howl({
                    urls: ["sounds/sfx_ui/sfx_ui_popup.mp3"],
                    volume:.5
                }).play();
                this.showInfoText("Tap on what you would like to shoot.")
                this.select(function(x,y,obj){
                    if(x!=-1&&y!=-1){
                        _this.player.rangeAttackTarget(x,y,obj);
                    }
                });
            }
            else {
                new Howl({
                    urls: ["sounds/sfx_ui/sfx_ui_negative1_1.mp3"],
                    volume:.5
                }).play();
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
        if(this.mainframeUnplugged){
            if(this.endGame0.isWithin(x,y)){
                var _this = this;
                this.mainframeUnplugged = false;
                this.music.fade(1,0,1000)
                this.music = new Howl({
                    urls: ['sounds/EndChoice1.ogg','sounds/EndChoice1.mp3']
                }).play();
                _this.showDialog("No... you can't! *the AIs voice echoes loudly in her domain as you approach and raise your weapons over the cords that pump into her units*",Resources.getImage("mainframe_1"),Resources.getImage("mainframe_2"),function(){
                    _this.showDialog("*you look over the glowing screen of flicking hologram and destroy electronic interfaces, the tendrils of lights and contracting cables mixed with the gnashing of metal from the inside*",Resources.getImage("mainframe_1"),Resources.getImage("mainframe_2"),function(){
                        _this.showDialog("*The face of the AI contorts and begins to distort as its systems shut down, and a static voice echoes through the room*",Resources.getImage("mainframe_1"),Resources.getImage("mainframe_2"),function(){
                            _this.showDialog("Peace at last ...",Resources.getImage("nu11"),Resources.getImage("nu11"),function(){
                                _this.showDialog("THE END",_this.player.image_idle_0,_this.player.image_idle_1,function(){
                                    _this.music.fade(1,0,1000,function(){
                                        _this.music.stop();
                                        _this.game.changeScene(new CreditsScene(_this.game));
                                    });
                                });
                            })
                        });
                    })
                });
            }
            if(this.endGame1.isWithin(x,y)){
                var _this = this;
                this.mainframeUnplugged = false;
                if(this.player.class == "samurai"){
                    this.music.fade(1,0,1000)
                    this.music = new Howl({
                        urls: ['sounds/EndChoice2.ogg','sounds/EndChoice2.mp3']
                    }).play();
                    _this.showDialog("*You step around behind the large machine with your weapon in hand, knowing the voice comes from inside, you toss aside your samurai hat and grasp your hands into the heart of the machine, ripping out wires and metal plates*",_this.player.image_idle_0,_this.player.image_idle_1,function(){
                        _this.showDialog("No! You can't have herrrrr.r.....r *the voice of the AI rages as it distorts into echo of bass*",Resources.getImage("mainframe_1"),Resources.getImage("mainframe_2"),function(){
                            _this.showDialog("*You grasp ahold of an arm deep inside the guts of the AIs form, with your strength you pull out the body of a woman*",_this.player.image_idle_0,_this.player.image_idle_1,function(){
                                _this.showDialog("...",Resources.getImage("nu11"),Resources.getImage("nu11"),function(){
                                    _this.showDialog("*she blinks... as if waking up from what had been a dark dream*",Resources.getImage("nu11"),Resources.getImage("nu11"),function(){
                                        _this.showDialog("Thank you ... *eyes closing and falling back into your arms",Resources.getImage("nu11"),Resources.getImage("nu11"),function(){
                                            _this.showDialog("THE END",_this.player.image_idle_0,_this.player.image_idle_1,function(){
                                                _this.music.fade(1,0,1000,function(){
                                                    _this.music.stop();
                                                    _this.game.changeScene(new CreditsScene(_this.game));
                                                });
                                            });
                                        });
                                    });
                                })
                            });

                        })
                    });
                }
                else if(this.player.class == "hacker"){
                    this.music.fade(1,0,1000)
                    this.music = new Howl({
                        urls: ['sounds/EndChoice3.ogg','sounds/EndChoice3.mp3']
                    }).play();
                    _this.showDialog("*You step up behind the AI... digital scanners watching her through the specs of your computer headset*",_this.player.image_idle_0,_this.player.image_idle_1,function(){
                        _this.showDialog("Humanity will never understand their place..",Resources.getImage("mainframe_1"),Resources.getImage("mainframe_2"),function(){
                            _this.showDialog("There's a lot more to humanity than you've even seen...",_this.player.image_idle_0,_this.player.image_idle_1,function(){
                                _this.showDialog("Is that right?... show me *a voice says.. lacking rage...the voice of genuine curiosity*",Resources.getImage("mainframe_1"),Resources.getImage("mainframe_2"),function(){
                                    _this.showDialog("*You pause.. hesitantly.  Staring into her cables...for a breif moment you saw this machine for what it was.  A poor machine locked in a world known only of CASCORP* Fuck it... *you grab your computer headset and jack her straight into your machines digital web.  you can feel her presence pulsing as terabytes of information pass through you*",_this.player.image_idle_0,_this.player.image_idle_1,function(){
                                        _this.showDialog("*the machine fades into silence...*",Resources.getImage("mainframe_1"),Resources.getImage("mainframe_2"),function(){
                                            _this.showDialog("I ....",Resources.getImage("mainframe_1"),Resources.getImage("mainframe_2"),function(){
                                                _this.showDialog("I see now ....",Resources.getImage("mainframe_1"),Resources.getImage("mainframe_2"),function(){
                                                    _this.showDialog("*a silence it does not return from... the hum of the AIs physical frame quieting.. you get the feeling you are now alone in the room*",_this.player.image_idle_0,_this.player.image_idle_1,function(){
                                                        _this.showDialog("THE END",_this.player.image_idle_0,_this.player.image_idle_1,function(){
                                                            _this.music.fade(1,0,1000,function(){
                                                                _this.music.stop();
                                                                _this.game.changeScene(new CreditsScene(_this.game));
                                                            });
                                                        });
                                                    });
                                                });
                                            })
                                        });
                                    });
                                })
                            });

                        })
                    });
                }
                else if(this.player.class == "scientist"){
                    this.music.fade(1,0,1000)
                    this.music = new Howl({
                        urls: ['sounds/EndChoice4.ogg','sounds/EndChoice4.mp3']
                    }).play();
                    _this.showDialog("*You step up behind the AI... its greenish hologram flickering in the reflection of your science goggles* Oh.. yes.. I see now.. what you are",_this.player.image_idle_0,_this.player.image_idle_1,function(){
                        _this.showDialog("*the mainframe begins to buzz as you start to grab into her wires* What... what are you doing?... that is my override patch",Resources.getImage("mainframe_1"),Resources.getImage("mainframe_2"),function(){
                            _this.showDialog("No, don't do that!",Resources.getImage("nu11"),Resources.getImage("nu11"),function(){
                                _this.showDialog("I'm sorry, I cannot let such a precious work of science go to waste *You grab cable cords, plugging them into your neckport as you spawn up terminal interfaces, overriding controls into your network with a barrage of virus programs",_this.player.image_idle_0,_this.player.image_idle_1,function(){
                                    _this.showDialog("Ahhh *you hear screams from inside as the mainframe host machine starts to integrate your sensorium into itself*",Resources.getImage("nu11"),Resources.getImage("nu11"),function(){
                                        _this.showDialog("You can't .. no... noo. o o *the voice of the AI distorted...until it rose back*... Ah.....the power.. Mainframe is mine ",Resources.getImage("mainframe_1"),Resources.getImage("mainframe_2"),function(){
                                            _this.showDialog("Muhahahaha ",Resources.getImage("mainframe_1"),Resources.getImage("mainframe_2"),function(){
                                                _this.showDialog("THE END",Resources.getImage("mainframe_1"),Resources.getImage("mainframe_2"),function(){
                                                    _this.music.fade(1,0,1000,function(){
                                                        _this.music.stop();
                                                        _this.game.changeScene(new CreditsScene(_this.game));
                                                    });
                                                });
                                            })
                                        });
                                    });
                                })
                            });

                        })
                    });
                }
            }
            return;
        }
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
            new Howl({
                urls: ["sounds/sfx_ui/sfx_ui_popdown.mp3"],
                volume:.5
            }).play();
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
    }
}

TestScene.prototype.pickupNearestTarget = function(){
    this.player.pickup(this.pickup_target);
}

TestScene.prototype.wait = function() {
    this.player.wait();
}

TestScene.prototype.select = function(onselect){
    this.onselect = onselect;
    this.mode = "select";
}

TestScene.prototype.onDie = function(){
    if(this.mode == "dead"){
        return;
    }
    this.showInfoText("You Died");
    var song = this.music;
    this.music.fade(1,0,1000,function(){
        song.stop();
    });

    ga('send', 'death');
    this.game.changeScene(new DeathScene(this.game));
    this.mode = "dead";
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
    if(this.infoText.length > 5){
        this.infoText.splice(0,1);
    }
}
