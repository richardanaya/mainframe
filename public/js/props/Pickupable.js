var Pickupable = function(){
    this.x = 0;
    this.y = 0;
    this.image = Resources.images.up_elevator;
    this.tags = ["item"];
}


Pickupable.prototype = Object.create(GameObject.prototype);

Pickupable.prototype.onObjectEnter = function(o){

}

Pickupable.Items = {
    "lab_note" : {
        name: "Lab Note",
        description: "Lab Note: Something has gone awry down in the lab",
        read_on_pickup: true,
        image : "lab_note"
    }
}

Pickupable.prototype.onPickup = function(o){
    if(this.read_on_pickup){
        this.level.scene.showDialog(this.description);
    }
}

Pickupable.load = function(name){
    var p = new Pickupable();
    p.name = Pickupable.Items[name].name;
    p.description = Pickupable.Items[name].description;
    p.read_on_pickup = Pickupable.Items[name].read_on_pickup;
    p.image = Resources.images[Pickupable.Items[name].image];
    return p;
}