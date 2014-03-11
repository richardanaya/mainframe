var Monster = function(){
    Character.call(this);
    this.x = 0;
    this.y = 0;
    this.image = Resources.images.robot;
    this.image_idle_0 = Resources.images.robot_idle_0;
    this.image_idle_1 = Resources.images.robot_idle_1;
    this.tags = ["solid","monster"];
    this.name = "Robot";
    this.strength = 1;
    this.accuracy = 0;
    this.mind = 0;
    this.defence = 6;
    this.armor = 1;
    this.damage = 1;

    // AI
    this.timeLost = 0;
    this.lostWait = 3; // if we lost sight of the player how long does that "disable" us to give them a chance to get away?
    this.playerLastKnownLocation = null;
};

Monster.prototype = Object.create(Character.prototype);

Monster.List = {
    rat : {
        name : "Rat",
        strength : 5,
        defence : 3,
        armor : 0,
        damage : 3,
        health: 4,
        accuracy : 0,
        mind : 0,
        image_0 : "rat_1",
        image_1 : "rat_2",
        tags: ["solid","monster","fleshy"],
        levels: [900,800,700,600,500,400,300,200,100,0]
    },
    rat_man : {
        name : "Rat Man",
        strength : 6,
        defence : 3,
        armor : 0,
        damage : 4,
        health: 5,
        accuracy : 0,
        mind : 0,
        tags : ["solid","monster","fleshy"],
        image_0 : "MutantRatMan1",
        image_1 : "MutantRatMan2",
        levels: [900,800,700,600,500,400,300,200,100,0]
    },
    businessman : {
        name : "Businessman",
        strength : 5,        
        defence : 2,
        armor : 0,
        damage : 5,
        health: 5,
        accuracy : 4,
        mind : 0,
        tags : ["solid","monster","fleshy"],
        image_0 : "businessman_1",
        image_1 : "businessman_2",
        levels: [900,800,700,600,500,400,300,200,100,0]
    },
    mutant_roach : {
        name : "Mutant Roach",
        strength : 4,
        defence : 4,
        armor : 1,
        damage : 3,
        health: 15,
        accuracy : 0,
        mind : 0,
        image_0 : "MutantRoach1",
        image_1 : "MutantRoach1",
        levels: [900,800,700,600,500,400,300,200,100,0]
    },
    bandit : {
        name : "Bandit",
        strength : 12,
        defence : 2,
        armor : 0,
        damage : 10,
        health: 3,
        accuracy : 0,
        mind : 0,
        tags : ["solid","monster","fleshy"],
        image_0 : "bandit",
        image_1 : "bandit",
        levels: [900,800,700,600,500,400,300,200,100,0]
    },
    crab_bot : {
        name : "Crab Bot",
        strength : 5,
        mind : 0,
        defence : 3,
        armor : 3,
        damage : 3,
        health: 5,
        tags : ["solid","monster","robo"],
        image_0 : "robot_1",
        image_1 : "robot_2",
        levels: [900,800,700,600,500,400,300,200,100,0]
    },
    robot_guard : {
        name : "Robot Guard",
        strength : 8,
        defence : 2,
        armor : 1,
        damage : 6,
        health: 10,
        accuracy : 0,
        mind : 0,
        tags : ["solid","monster","robo"],
        image_0 : "RobotGuard1",
        image_1 : "RobotGuard2",
        levels: [900,800,700,600,500,400,300,200,100,0]
    },
    sentry_1 : {
        name : "Sentry",
        strength : 10,
        defence : 2,
        armor : 1,
        damage : 7,
        health: 10,
        accuracy : 0,
        mind : 0,
        image_0 : "Sentry2_1",
        image_1 : "Sentry2_2",
        tags : ["solid","monster","robo"],
        levels: [900,800,700,600,500,400,300,200,100,0]
    },
    sentry_2 : {
        name : "Sentry",
        strength : 8,
        defence : 2,
        armor : 1,
        damage : 5,
        health: 12,
        accuracy : 0,
        mind : 0,
        image_0 : "Sentry3_1",
        image_1 : "Sentry3_2",
        tags : ["solid","monster","robo"],
        levels: [900,800,700,600,500,400,300,200,100,0]
    },
    sentry_3 : {
        name : "Sentry",
        strength : 10,
        accuracy : 0,
        mind : 0,
        defence : 1,
        armor : 0,
        damage : 2,
        health: 20,
        image_0 : "SentryBot1_1",
        image_1 : "SentryBot1_2",
        tags : ["solid","monster","robo"],
        levels: [900,800,700,600,500,400,300,200,100,0]
    },
    sentry_cat : {
        name : "Sentry Cat",
        strength : 15,
        accuracy : 0,
        mind : 0,
        defence : 15,
        armor : 0,
        damage : 1,
        health: 1,
        image_0 : "SentryCat_1",
        image_1 : "SentryCat_2",
        tags : ["solid","monster","robo"],
        levels: [900,800,700,600,500,400,300,200,100,0]
    },
    ninja : {
        name : "Ninja",
        strength : 15,
        accuracy : 0,
        mind : 0,
        defence : 15,
        armor : 0,
        damage : 2,
        health: 4,
        image_0 : "ninja_1",
        image_1 : "ninja_1",
        tags : ["solid","monster","fleshy"],
        levels: [900,800,700,600,500,400,300,200,100,0],
        canSeeThroughStealth: true,
    },
    cyborg : {
        name : "Cyborg",
        strength : 10,
        defence : 2,
        armor : 5,
        damage : 5,
        health: 10,
        accuracy : 0,
        mind : 0,
        image_0 : "cyborg_1",
        image_1 : "cyborg_1",
        tags : ["solid","monster","fleshy","robo"],
        levels: [900,800,700,600,500,400,300,200,100,0]
    },
    greygoo : {
        name : "Grey Goo",
        strength : 20,
        defence : 5,
        armor : 7,
        damage : 1,
        health: 20,
        accuracy : 0,
        mind : 0,
        image_0 : "greygoo_1",
        image_1 : "greygoo_1",
        levels: [400,300,200,100,0]
    },
    sop13: {
        name: "SOP13",
        strength: 10,
        defense: 100,
        armor: 100,
        damage: 1,
        health: 100,
        mind: 0,
        image_0: "SOP13_1",
        image_1: "SOP13_2",
        levels: [],
        tags: ["solid","ally"]
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
    if(pi.tags) { 
        p.tags = p.tags.concat(pi.tags);
    }
    p.armor = pi.armor;
    p.damage = pi.damage;
    p.image_idle_0 = Resources.getImage(pi.image_0);
    p.image_idle_1 = Resources.getImage(pi.image_1);

    if( pi.canSeeThroughStealth ) { 
        p.canSeeThroughStealth = true;
    }
    return p;
}

Monster.prototype.getPathTo = function( target ) {
    var start = this.level.scene.graph.nodes[this.x][this.y];
    var end = this.level.scene.graph.nodes[target.x][target.y];
    return astar.search(this.level.scene.graph.nodes, start, end);
}

Monster.prototype.friendlyThink = function() {
    var p = this.level.scene.player;
    result = [];
    if( p.aggro != null ) {
        result = this.getPathTo( p.aggro );
    }
    else
    {
        result = this.getPathTo( p );
    }

    if(result.length > 0){
        //get next position a* thinks we should go
        var rx = result[0].x;
        var ry = result[0].y;

        //if player is there attack
        if(p.aggro != null && rx == p.aggro.x && ry == p.aggro.y){
            this.attack(p.aggro,null);
        }
        else {
            //move toward the player
            this.move(result[0].x,result[0].y);
        }
    }

    return this.moves;
}

Monster.prototype.think = function(){
    if( this.tags.indexOf( "ally" ) != -1 ) {
        return this.friendlyThink();
    }

    var result = [];
    var p = this.level.scene.player;
    var curTile = this.getCurrentTile();

    if( --this.stunCount > 0 ) {
        this.level.scene.showInfoText( this.name + ' is stunned!' );
        return result;
    }

    if( p.camoCount > 0  && !this.canSeeThroughStealth ) {
        this.lastKnownPlayerLocation = null;
        return result;
    }
    // if we're not standing a on a valid tile, or it hasn't been explored yet sleep
    else if( curTile != null && curTile != undefined && curTile.explored ) {
       if( curTile.room != p.getCurrentTile().room ) {
            if( p.aggro == this ) p.aggro = false;
            // if we've seen the player before, try and find them at that location
            if( ++this.timeLost <= this.lostWait ) {
                if( this.timeLost <= 2 ) {
                    this.lastKnownPlayerLocation = { x: p.x, y:p.y };
                }
            }
            else if( this.lastKnownPlayerLocation != null ) {
                // if we are at the last known location, and we still can't see the player, go back to sleep.    
                if( this.x == this.lastKnownPlayerLocation.x && this.y == this.lastKnownPlayerLocation.y ) {
                    this.lastKnownPlayerLocation = null;
                    return result;
                }
                else { // if we can't see the player, but we know where we last saw them, move towards that
                    result = this.getPathTo( this.lastKnownPlayerLocation );
                }
            }
            else
            {
                return result;
            }
        }
        else {
            // we can see the player, so store their last known location
            this.timeLost = 0;
            this.lastKnownPlayerLocation = { x:p.x, y:p.y };
            result = this.getPathTo( p );
            p.aggro = this;
        }
    }
    
    if(result.length > 0){
        //get next position a* thinks we should go
        var rx = result[0].x;
        var ry = result[0].y;

        //if player is there attack
        if(rx == p.x && ry == p.y){
            this.attack(p,null);
        }
        else {
            //move toward the player
            this.move(result[0].x,result[0].y);
        }
    }

    return this.moves;
}