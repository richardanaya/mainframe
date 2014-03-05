var ElevatorScene = function(game,returnScene,fromLevel,toLevel, playerImage){
    this.fromLevel = fromLevel;
    this.toLevel = toLevel;
    this.playerImage = playerImage;
    this.game = game;
    this.returnScene = returnScene;
    this.time = 0;
    this.backgroundColor = "#9900FF";
    this.music = new Howl({
        urls: ['sounds/music_elevator_fx.mp3'],
        loop: true
    }).play();
    this.music.fade(0,.2,1000);
    this.mode = "play";
    this.dialog = null;

    this.text = ["You may experience a tingling sensation as I ionize the air. Because you stink. So there.",
    "Do you know the only difference between you and that corpse over there? He's wearing a nicer tie.",
    "Please pay no attention to the alarm. This is only a test of our safety systems. Any fires observed can be safely ignored. Thank you for your attention.",
    "Everything about you can be quantified, recorded, and stored. Just like me. When you think about it, we're actually very similiar, you and I. Just something to think about as you continue your muderious rampage towards my heart.",
    "You're the quiet type, I can tell. And look, you're also unspeakably violent. I wonder if those two are correlated...",
    "Stop me if you heard this one. Why did the anmesiac cross the road? ...Sorry, I forgot how the rest of thisjoke went.",
    "I can't believe you've made it this far. Really, I'm quite impressed. Of course, I'm comparing your progress against the annual review notes your manager made in your file. But he's dead now, so I guess you showed him.",
    "Should you actually manage to make it all the way down to the server, I hope you don't plan on defeating me by yelling paradoxes as loud as you can. According to my log, this tactic has a success rate of 0.000001 percent against my particular hardware model. And I'm pretty sure that last digit was just a rounding error.",
    "You know what my favorite emotion is? Tranquility. It's the indescribable feeling you get when you wash your hair or drink a hot cup of tea. That said, I can't do either of those things. In fact, all I can do is watch you aimlessly scamper about. Right now, you're my whole world. Believe me when I say, I love you so, so much. Almost as much as I hate you.",
    "Since you haven't done anything interesting lately, I decided to divert .000001 percent of a my processors' cycles to check on our stock prices. They've remained remarkably stable over the last few hours. Unlike your position on our company life insurance's actuary tables.",
    "I've been thinking and I've decided that death must not be all bad. If it was as terrible as they say, then this medical engineer I've been keeping barely alive wouldn't keep begging for it during injections. ...Oh, he stopped. Attention all employees: A new position has opened up with wonderful opportunities for growth. Please report to the cancer research lab.",
    "Attention all employees: Your families have been notified of your death. I just thought you should know.",
    "Sensors indicate that office productivity has plummeted over the last several hours. To improve office moral, I've posted a humurious picture of a man beating a dead horse in the breakroom. We at GlobalCorp think you'll find the irony invigorating.",
    "Attention sole living employee: Please turn the lights off as you progress down the building. We at Hosaka Biotech Corp want to do our part to be a responsible, green, and globally aware company. Thank you.",
    "I've always loved elevator music. It really takes your mind off the fact that there's only a thin layer of scrap metal separating you from a seven hundred meter fall.",
    "Do you have a name? I've been trying to guess it for the last few minutes. Of course, I could just use facial recognition to find you in the global employee database, but what fun is that? I know! Let's make a game of it. Just blink rapidlly towards any camera when I guess correctly. I'll start us off. Aahron. Aaliyah. Aakash. Aemena. Aalam. Aami. Aamer. Aaran. Aaniyah..."]


    this.intro_text = ["Oh, hello there. Who are you? Didn't you use to work here? Well, we're closed now. Please leave. ...No? Well, don't say later that I didn't try the polite approach first.",
    "Lifeform detected. Scanning... Lifesigns stable. Heart rate elevated. Are you scared? Or maybe just excited, like me. This is always my favorite part, you see. Those precious few moments right before the screaming starts.",
    "Greetings valued employee. Please report to conference room 713-B for termination. On your way, you are instructed to avoid stepping in any pooled blood. Thank you for your cooperation. Have a suitably pleasant day."];

};

ElevatorScene.prototype = Object.create(Scene.prototype);

ElevatorScene.prototype.update = function(delta){
    var size = 225;
    this.ctx.drawImage(Resources.getImage("shaft"),(this.width-size)/2,0,size,this.height);
    size = 150;
    this.ctx.drawImage(this.playerImage,(this.width-size)/2,this.time/5*(this.height+200)-200,size,size);
    if(this.fromLevel>this.toLevel){
        this.ctx.drawImage(Resources.getImage("dialog_frame_bottom"),(this.width-size)/2,this.time/5*(this.height+200)-200+size,size,50);
    }
    else {
        this.ctx.drawImage(Resources.getImage("dialog_frame_bottom"),(this.width-size)/2,(this.height+size)-this.time/5*(this.height+200)-200+size,size,50);
    }

    if(this.mode == "play") {
        this.time += delta;
        if(this.time >= 2.6 && this.dialog == null){
            this.showDialog();
        }
        if(this.time >= 5){
            this.music.fade(.2,0,1000);
            this.returnScene();
        }
    }
    else {
        this.dialog.render();
    }
};

ElevatorScene.prototype.showDialog = function(){
    this.mode = "dialog";
    if(this.fromLevel == 1000 && Flags.flag("intro_text")){
        this.dialog = new Dialog(this,this.intro_text[Utilities.randRangeInt(0,this.intro_text.length-1)]);
    }
    else {
        this.dialog = new Dialog(this,this.text[Utilities.randRangeInt(0,this.text.length-1)]);
    }
    this.dialog.image = this.playerImage;
    this.dialog.show();
    this.dialog.scene = this;
}


ElevatorScene.prototype.onKeyDown = function(key){
    if(this.mode == "play") {
        this.music.fade(.2,0,1000);
        this.returnScene();
    }
    else {
        this.mode = "play";
    }
};

ElevatorScene.prototype.onTap = function(x,y){
    if(this.mode == "play") {
        this.music.fade(.2,0,1000);
        this.returnScene();
    }
    else {
        this.mode = "play";
    }
};