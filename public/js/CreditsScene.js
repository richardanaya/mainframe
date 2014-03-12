var CreditsScene = function(game,music){
    this.game = game;
    this.time = 0;
    this.music = new Howl({
        urls: ['sounds/Credits.ogg','sounds/Credits.mp3'],
        loop: true
    }).play();
};

CreditsScene.prototype = Object.create(Scene.prototype);

CreditsScene.prototype.update = function(delta){
    this.time += delta;
    var t = 0;
    if(this.time > 2){
        t = this.time-2;
    }


    //background
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0,0,this.width,this.height);


    this.ctx.strokeStyle = "#15dbc4";
    for (i=0;i<20;i++)
    {
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(this.width + (1.8 * this.width) - (300 * i) + 30 , this.height + 30);
        this.ctx.lineTo((0.4 * this.width) - (300 * i) - 30, - 30);
        this.ctx.stroke();
    }


    this.ctx.lineWidth = 20;
    this.ctx.globalAlpha = .2;
    this.ctx.strokeStyle = "#109486";
    for (i=0;i<20;i++)
    {
        this.ctx.beginPath();
        this.ctx.moveTo(this.width + (1.8 * this.width) - (300 * i) +30 , this.height + 30);
        this.ctx.lineTo((0.4 * this.width) - (300 * i) -30, -30);
        this.ctx.stroke();
    }

    this.ctx.globalAlpha = 1;




    this.ctx.strokeStyle = "#15dbc4";
    for (i=0;i<25;i++)
    {
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo((-0.5 * this.width) + (140 * i) - ((this.time % 2.8) * 100), this.height + 30);
        this.ctx.lineTo((-0.2 * this.width) + (140 * i) - ((this.time % 2.8) * 100), 0);
        this.ctx.stroke();
    }


    this.ctx.lineWidth = 20;
    this.ctx.globalAlpha = .2;
    this.ctx.strokeStyle = "#109486";
    for (i=0;i<25;i++)
    {
        this.ctx.beginPath();
        this.ctx.moveTo((-0.5 * this.width) + (140 * i) - ((this.time % 2.8) * 100), this.height + 30);
        this.ctx.lineTo((-0.2 * this.width) + (140 * i) - ((this.time % 2.8) * 100), 0);
        this.ctx.stroke();
    }

    this.ctx.globalAlpha = 1;



    var grd=this.ctx.createLinearGradient(0,0,0,170);
    grd.addColorStop(.3,"#100839");
    grd.addColorStop(1,"#932f6b");
    grd.addColorStop(1,"#932f6b");

    this.ctx.fillStyle=grd;
    this.ctx.beginPath();
    this.ctx.moveTo(this.width + (1.8 * this.width) - 570 , this.height + 30);
    this.ctx.lineTo((0.4 * this.width) - 630, -30);
    this.ctx.lineTo(this.width, 0);

    this.ctx.fill();


    if(this.time > 60){
        this.ctx.font = "36px 'Press Start 2P'";
        this.ctx.fillStyle = "white";
        this.ctx.globalAlpha = Math.min((this.time-60)/2,.2);
        this.ctx.fillText("Mainframe Loves You", (this.width-this.ctx.measureText("Mainframe Loves You").width)/2-15, this.height/2-15);
        this.ctx.globalAlpha = Math.min((this.time-60)/2,1);
        this.ctx.fillText("Mainframe Loves You", (this.width-this.ctx.measureText("Mainframe Loves You").width)/2, this.height/2);

    }



    var speed = 50;
    this.ctx.drawImage(Resources.getImage("heart"),(window.innerWidth-200)/2,(window.innerHeight-200)/2-t*speed,200,200);


    this.ctx.font = "36px 'Press Start 2P'";
    this.ctx.fillStyle = "white";
    this.ctx.globalAlpha = .2;
    this.ctx.fillText("TEAM PANTHER MODERNS", (this.width-this.ctx.measureText("Mainframe Loves You").width)/2-15, (window.innerHeight-200)/2+600-t*speed-15);
    this.ctx.globalAlpha = 1;
    this.ctx.fillText("TEAM PANTHER MODERNS", (this.width-this.ctx.measureText("Mainframe Loves You").width)/2, (window.innerHeight-200)/2+600-t*speed);


    this.ctx.font = "16px 'Press Start 2P'";
    this.ctx.fillStyle = "white";
    this.drawPerson((window.innerWidth-710)/2,(window.innerHeight-200)/2+700-t*speed,Resources.getImage("richard"),"Richard Anaya", "Voyoku", "Lead Programmer/Organizer","Above the earth, beneath the sky");
    this.drawPerson((window.innerWidth-710)/2,(window.innerHeight-200)/2+900-t*speed,Resources.getImage("cooper"),"Cooper Welch", "Voyoku", "Lead Art","");
    this.drawPerson((window.innerWidth-710)/2,(window.innerHeight-200)/2+1100-t*speed,Resources.getImage("emil"),"Emil Ernstrom", "", "Lead Music","");
    this.drawPerson((window.innerWidth-710)/2,(window.innerHeight-200)/2+1300-t*speed,Resources.getImage("howard"),"Howard Smith", "Black Triangles", "Programmer/Host","");
    this.drawPerson((window.innerWidth-710)/2,(window.innerHeight-200)/2+1500-t*speed,Resources.getImage("teo"),"Teo Acosta", "Abducted By Sharks", "Music","");
    this.drawPerson((window.innerWidth-710)/2,(window.innerHeight-200)/2+1700-t*speed,Resources.getImage("jack"),"Jack Reed", "", "Programmer","");
    this.drawPerson((window.innerWidth-710)/2,(window.innerHeight-200)/2+1900-t*speed,Resources.getImage("carpe"),"Carpe", "", "Music","");
    this.drawPerson((window.innerWidth-710)/2,(window.innerHeight-200)/2+2100-t*speed,Resources.getImage("tentative"),"tentative-stagename", "", "Music","");
    this.drawPerson((window.innerWidth-710)/2,(window.innerHeight-200)/2+2300-t*speed,Resources.getImage("jonathan"),"Jonathan Churchill", "", "Sound","");
    this.drawPerson((window.innerWidth-710)/2,(window.innerHeight-200)/2+2500-t*speed,Resources.getImage("brian"),"Brian Ho", "", "Art","");

    this.ctx.font = "12px 'Press Start 2P'";
    this.ctx.fillText("Thanks to Sophie - the best dog ever",(window.innerWidth-710)/2,(window.innerHeight-200)/2+2700-t*speed);
    this.ctx.fillText("Thanks to Hank Smith for the delicious steak and caffeine",(window.innerWidth-710)/2,(window.innerHeight-200)/2+2730-t*speed);
    this.ctx.fillText("Thanks to /u/Hellisothersheeple for our megacorp name",(window.innerWidth-710)/2,(window.innerHeight-200)/2+2760-t*speed);
    this.ctx.fillText("Thanks to Irka for insights into psychopathic AIs",(window.innerWidth-710)/2,(window.innerHeight-200)/2+2790-t*speed);
};

CreditsScene.prototype.drawPerson = function(x,y,icon,name, group, role, saying){
    this.ctx.drawImage(icon,x,y,100,100);
    if(group){
        this.ctx.fillText(name+" @ "+group,x+110,y+30);
    }
    else {
        this.ctx.fillText(name,x+110,y+30);
    }
    this.ctx.fillText(role,x+110,y+30+30);
    function wrapText(context, text, x, y, maxWidth, lineHeight) {
        var words = text.split(' ');
        var line = '';

        for(var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + ' ';
            var metrics = context.measureText(testLine);
            var testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                context.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
            }
            else {
                line = testLine;
            }
        }
        context.fillText(line, x, y);
    }

    if(saying!=""){
        wrapText(this.ctx,'"'+saying+'"',x+110,y+60+30,600,30);
    }
}


CreditsScene.prototype.onKeyDown = function(key){
    this.music.fade(1,0,1000);
    this.game.changeScene(new StartScene(this.game));
};

CreditsScene.prototype.onTap = function(x,y){
    this.music.fade(1,0,1000);
    this.game.changeScene(new StartScene(this.game));
};