var Pickupable = function(){
    this.x = 0;
    this.y = 0;
    this.image = Resources.images.up_elevator;
    this.tags = ["item"];
}


Pickupable.prototype = Object.create(GameObject.prototype);

Pickupable.prototype.onObjectEnter = function(o){

}

Pickupable.prototype.onAction = function(action){
    if(action == "look at"){
        this.level.scene.showDialog(this.description);
    }
}

Pickupable.Items = {
    "lab_note" : {
        name: "Lab Note",
        description: "Lab Note: Something has gone awry down in the labLab Note: Something has gone awry down in the labLab Note: Something has gone awry down in the labLab Note: Something has gone awry down in the lab",
        read_on_pickup: true,
        actions: ["look at"],
        image : "lab_note"
    },
    "keycard" : {
        name: "Keycard",
        image : "keycard",
        actions: ["look at"],
        description: "A keycard that looks like it can be used at corporate level"
    }
}

Pickupable.prototype.onPickup = function(o){
    if(this.read_on_pickup){
        this.level.scene.showDialog(this.description);
    }
}

Pickupable.load = function(name){
    var pi = Pickupable.Items[name];
    var p = new Pickupable();
    p.name = pi.name;
    p.description = pi.description;
    p.read_on_pickup = pi.read_on_pickup;
    p.actions = pi.actions;
    p.image = Resources.getImage(pi.image);
    return p;
}