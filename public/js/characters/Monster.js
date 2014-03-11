var Monster = function(){
    Character.call(this);
    this.x = 0;
    this.y = 0;
    this.image = Resources.images.robot;
    this.image_idle_0 = Resources.images.robot_idle_0;
    this.image_idle_1 = Resources.images.robot_idle_1;
    this.tags = ["solid","monster"];
    this.name = "Robot";
    this.strength = 10;
    this.accuracy = 0;
    this.mind = 0;
    this.defence = 6;
    this.armor = 1;
    this.damage = 1;
};

Monster.prototype = Object.create(Character.prototype);

Monster.List = {
    robot : {
        name : "Robot",
        strength : 10,
        accuracy : 0,
        mind : 0,
        defence : 2,
        armor : 1,
        damage : 1,
        health: 5,
        image_0 : "robot_1",
        image_1 : "robot_2",
        levels: [900,800,700,600,500,400,300,200,100,0]
    },
    rat : {
        name : "Rat",
        strength : 10,
        accuracy : 0,
        mind : 0,
        health: 2,
        defence : 6,
        armor : 1,
        damage : 1,
        image_0 : "rat_1",
        image_1 : "rat_2",
        levels: [900,800,700,600,500,400,300,200,100,0]
    },
    yakuza : {
        name : "Businessman",
        strength : 10,
        accuracy : 0,
        mind : 0,
        health: 5,
        defence : 6,
        armor : 1,
        damage : 1,
        image_0 : "businessman_1",
        image_1 : "businessman_2",
        levels: [900,800,700,600,500,400,300,200,100,0]
    }
}


Monster.load = function(name){
    var pi = Monster.List[name];
    var p = new Monster();
    p.id = name;
    p.name = pi.name;
    p.strength = pi.strength;
    p.accuracy = pi.accuracy;
    p.mind = pi.mind;
    p.defence = pi.defence;
    p.health = pi.health;
    p.armor = pi.armor;
    p.damage = pi.damage;
    p.image_idle_0 = Resources.getImage(pi.image_0);
    p.image_idle_1 = Resources.getImage(pi.image_1);
    return p;
}

Monster.prototype.think = function(){

    var p = this.level.scene.player;
    var start = this.level.scene.graph.nodes[this.x][this.y];
    var end = this.level.scene.graph.nodes[p.x][p.y];
    var result = astar.search(this.level.scene.graph.nodes, start, end);
    /*var xOffset = (this.autoMoveX-this.x);
     if(xOffset != 0){ xOffset /= Math.abs(this.autoMoveX-this.x);}
     var yOffset = (this.autoMoveY-this.y);
     if(yOffset != 0){ yOffset /= Math.abs(this.autoMoveY-this.y);}*/

    /*
     */

    if(result.length > 0){
        var rx = result[0].x;
        var ry = result[0].y;
        if(rx == p.x && ry == p.y){
            this.attack(p,null);
        }
        else {
            this.move(result[0].x,result[0].y);
        }
    }

    return this.moves;
}