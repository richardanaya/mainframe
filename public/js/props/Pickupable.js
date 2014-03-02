var Pickupable = function(){
    this.x = 0;
    this.y = 0;
    this.image = Resources.images.up_elevator;
    this.tags = ["item"];
    this.id = "";
    this.equipped = false;
}


Pickupable.prototype = Object.create(GameObject.prototype);

Pickupable.prototype.onObjectEnter = function(o){

}

Pickupable.prototype.onAction = function(action){
    if(action == "look at"){
        this.level.scene.showDialog(this.description,this.image);
    }
    if(action == "drink"){
        this.level.scene.player.removeInventory(this);
        this.level.scene.showDialog("mmm, interesting",this.image);
    }
    if(action == "equip"){
        if(this.equipped){
            this.equipped = false;
            this.level.scene.inventoryDialog.show();
            return;
        }
        var items = this.level.scene.player.getInventoryWithTag(Pickupable.Items[this.id].equip_slot);
        for(var i = 0 ; i < items.length ; i++){
            items[i].equipped = false;
        }
        this.equipped = true;
        this.level.scene.inventoryDialog.show();
    }
}

Pickupable.Items = {
    "lab_note_0" : {
        name: "Lab Note: Sys Admin",
        description: "[System Administrators Note] We've been seeing large usage spikes in our engineering services again.  Mr. Yanatobi says not worry, will run more diagnostics next week",
        read_on_pickup: true,
        actions: ["look at"],
        image : "lab_note",
        floor_name : "scrap of paper"
    },
    "keycard" : {
        name: "Keycard",
        image : "keycard",
        actions: ["look at"],
        description: "A keycard that looks like it can be used at corporate level"
    },
    "juice_0" : {
        name: "Juice",
        image : "potion_1",
        actions: ["drink"],
        description: "A juice"
    },
    "juice_1" : {
        name: "Juice",
        image : "potion_2",
        actions: ["drink"],
        description: "A juice"
    },
    "juice_2" : {
        name: "Juice",
        image : "potion_3",
        actions: ["drink"],
        description: "A juice"
    },
    "juice_3" : {
        name: "Juice",
        image : "potion_4",
        actions: ["drink"],
        description: "A juice"
    }
}

Pickupable.prototype.onPickup = function(o){
    if(this.read_on_pickup){
        this.level.scene.showDialog(this.description,this.image);
    }
}

Pickupable.load = function(name){
    var pi = Pickupable.Items[name];
    var p = new Pickupable();
    p.id = name;
    p.name = pi.name;
    p.description = pi.description;
    p.read_on_pickup = pi.read_on_pickup;
    if(pi.tags){ p.tags = p.tags.concat(pi.tags); }
    if(pi.actions){ p.actions = pi.actions; }
    p.image = Resources.getImage(pi.image);
    return p;
}