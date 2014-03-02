var TestScene = function(game){
    this.game = game;
    this.infoText = [];
    this.time = 0;
    this.player = new Player();
    this.currentHeight = 1000
    this.mode = "play";
    this.showDialog("There's a robot! quick, kill it!");
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

        //var moveToX = Math.floor((event.offsetX-_this.viewTranslateX)/_this.viewScaleX/_this.size);
        //var moveToY = Math.floor((event.offsetY-_this.viewTranslateY)/_this.viewScaleY/_this.size);
        if(event.deltaY>0){
            /*var mx = Math.floor((event.offsetX-_this.viewTranslateX)/_this.viewScaleX);
            var my = Math.floor((event.offsetY-_this.viewTranslateY)/_this.viewScaleY);
            var mxafter = Math.floor((event.offsetX-_this.viewTranslateX)/(_this.viewScaleX +.1));
            var myafter = Math.floor((event.offsetY-_this.viewTranslateY)/(_this.viewScaleY +.1));
            _this.viewTranslateX += (mxafter-mx)/2;
            _this.viewTranslateY += (myafter-my)/2;*/
            _this.viewScaleX +=.1;
            _this.viewScaleY +=.1;
        }
        else {
            /*var mx = Math.floor((event.offsetX-_this.viewTranslateX)/_this.viewScaleX);
            var my = Math.floor((event.offsetY-_this.viewTranslateY)/_this.viewScaleY);
            var mxafter = Math.floor((event.offsetX-_this.viewTranslateX)/(_this.viewScaleX -.1));
            var myafter = Math.floor((event.offsetY-_this.viewTranslateY)/(_this.viewScaleY -.1));
            _this.viewTranslateX -= mxafter-mx;
            _this.viewTranslateY -= myafter-my;*/
            /*_this.viewTranslateX += (_this.viewTranslateX-mx)/2*.1
            _this.viewTranslateY += (_this.viewTranslateY-my)/2*.1*/
            _this.viewScaleX -=.1;
            _this.viewScaleY -=.1;
        }
        _this.centerViewAroundPlayer();//moveToX,moveToY);
    });

    Hammer($('#screen').get(0)).on("drag", function(e) {
        _this.viewTranslateX = _this.viewTranslateStartX+e.gesture.deltaX;
        _this.viewTranslateY = _this.viewTranslateStartY+e.gesture.deltaY;
        //this.viewTranslateX += e.gesture.touches[0].offsetX;
    });

    this.loadLevel(this.currentHeight)
};

TestScene.prototype = Object.create(Scene.prototype);

TestScene.prototype.loadLevel = function(height){
    this.player.stopAutoMove();
    this.level = this.game.GetLevel(height);
    this.level.addObjectTo(0,0,new Robot());
    var upElevator = new UpElevator();
    this.level.addObjectTo(Math.floor(Math.random()*9), Math.floor(Math.random()*9),upElevator);
    var downElevator = new DownElevator();
    this.level.addObjectTo(Math.floor(Math.random()*9), Math.floor(Math.random()*9),downElevator);
    if(height<=this.currentHeight){
        this.level.addObjectTo(upElevator.x,upElevator.y,this.player);
        this.showInfoText("You moved down")
    }
    else {
        this.level.addObjectTo(downElevator.x,downElevator.y,this.player);
        this.showInfoText("You moved up")
    }
    if(height == 1000){
        var item = Pickupable.load("lab_note")
        this.level.addObjectTo(Math.floor(Math.random()*9), Math.floor(Math.random()*9),item);
    }

    this.centerViewAroundPlayer();

    this.level.scene = this;
    this.currentHeight = height;
};

TestScene.prototype.centerViewAroundPlayer = function(){
    this.centerViewAroundSquare(this.player.x,this.player.y);
}

TestScene.prototype.centerViewAroundSquare = function(x,y){
    this.viewTranslateX = (-x*this.size-this.size/2)*this.viewScaleX+window.innerWidth/2;
    this.viewTranslateY = (-y*this.size-this.size/2)*this.viewScaleY+window.innerHeight/2;
}

TestScene.prototype.update = function(delta){
    this.time += delta;
    this.ctx.save();
    this.ctx.translate(this.viewTranslateX,this.viewTranslateY);
    this.ctx.scale(this.viewScaleX,this.viewScaleY);
    for(var x = 0; x < this.level.width; x++){
        for(var y = 0; y < this.level.width; y++){
            var t = this.level.tiles[this.level.width*y+x];
            this.ctx.drawImage(t.image,x*this.size ,y*this.size,this.size ,this.size  );
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
    this.ctx.restore();

    if(this.showPickup){
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(this.width-50,100,50,50);
        this.ctx.drawImage(this.pickup_target.image,this.width-50,100,50,50)
    }

    if(this.showAttack){
        this.ctx.fillStyle = "red";
        this.ctx.fillRect(this.width-50,160,50,50);
        this.ctx.drawImage(this.attack_target.image,this.width-50,160,50,50)
    }

    this.ctx.font = "20px Arial";
    this.ctx.fillStyle = "white";
    this.ctx.fillText(this.currentHeight,this.width-80, 30);

    for(var i = 0 ; i < this.infoText.length ; i++){
        this.ctx.fillText(this.infoText[i].text,10, this.height-30*i-15);
    }

    if(this.mode == "dialog"){
        this.dialog.render();
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
        this.showInfoText("You are standing on something");
        if(this.pickup_target != pickup_targets[0]){ options_changed = true;}
        this.pickup_target = pickup_targets[0];
        this.showPickupButton();
    }
    else {
        this.hidePickupButton();
        this.pickup_target = null;
    }
    var attack_targets = this.level.getNeighborObjectsByType(this.player.x,this.player.y,"monster");
    if(attack_targets.length>0){
        this.showInfoText("There's a monster nearby you can attack");
        if(this.attack_target != attack_targets[0]){ options_changed = true;}
        this.attack_target = attack_targets[0];
        this.showAttackButton();
    }
    else {
        this.hideAttackButton();
        this.attack_target = null;
    }
    return options_changed;
}


TestScene.prototype.showPickupButton = function(){
    this.showPickup = true;
}

TestScene.prototype.hidePickupButton = function(){
    this.showPickup = false;
}

TestScene.prototype.showAttackButton = function(){
    this.showAttack = true;
}

TestScene.prototype.hideAttackButton = function(){
    this.showAttack = false;
}

TestScene.prototype.onKeyDown = function(key){
    if(this.mode == "play"){
        if(key == 37){
            this.player.moveLeft();
        }
        else if(key == 38){
            this.player.moveUp();
        }
        else if(key == 39){
            this.player.moveRight();
        }
        else if(key == 40){
            this.player.moveDown();
        }
        this.processAllMoves();
    }
    else if(this.mode == "dialog"){
        this.mode = "play";
    }
};


TestScene.prototype.onTap = function(x,y){
    if(this.mode == "play"){
        var moveToX = Math.floor((x-this.viewTranslateX)/this.viewScaleX/this.size);
        var moveToY = Math.floor((y-this.viewTranslateY)/this.viewScaleY/this.size);
        if(this.level.isPointWithin(moveToX,moveToY)){
            this.player.autoMoveTo(Math.floor(moveToX),Math.floor(moveToY));
            this.player.autoMove();
            this.processAllMoves();
        }

        if(this.showPickup){
            if(x>=this.width-50&&x<this.width&&y>=100&&y<150){
                this.player.pickup(this.pickup_target);
                this.processAllMoves();
                return;
            }
        }

        if(this.showAttack){
            if(x>=this.width-50&&x<this.width&&y>=160&&y<210){
                this.player.attack(this.attack_target);
                this.processAllMoves();
                return;
            }
        }
    }
    else if(this.mode == "dialog"){
        this.mode = "play";
    }
}

TestScene.prototype.showDialog = function(text){
    this.mode = "dialog";
    this.dialog = new Dialog(text);
    this.dialog.show();
    this.dialog.scene = this;
}

TestScene.prototype.showInfoText = function(text){
    this.infoText.push({text:text,time:this.time});
    if(this.infoText.length > 3){
        this.infoText.splice(0,1);
    }
}
