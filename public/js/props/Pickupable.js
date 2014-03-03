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
    var _this = this;
    if(action == "look at"){
        this.level.scene.showDialog(this.description,this.image);
    }
    if(action == "drink"){
        this.level.scene.showDialog("mmm, interesting",this.image);
        this.level.scene.player.removeInventory(this);
    }
    if(action == "throw"){
        this.level.scene.showInfoText("What do you want to throw at?");
        this.level.scene.select(function(x,y,obj){
            alert("okay "+x+" "+y);;
        })
    }
    if(action == "use"){
        this.level.scene.inventoryDialog.select("drink", function(i){
            alert(i.name)
            _this.level.scene.inventoryDialog.hide();
        });
    }
    if(action == "equip"){
        if(this.equipped){
            this.equipped = false;
            this.player.level.scene.inventoryDialog.show();
            return;
        }
        var items = this.player.getInventoryWithTag(Pickupable.Items[this.id].equip_slot);
        for(var i = 0 ; i < items.length ; i++){
            items[i].equipped = false;
        }
        this.equipped = true;
        if(Pickupable.Items[this.id].equip_slot == "ranged"){
            this.player.useRanged(this);
        }
        this.player.level.scene.inventoryDialog.show();
    }
}

Pickupable.Items = {
    "gun" : {
        name: "Gun",
        description: "A trusty gun",
        read_on_pickup: true,
        actions: ["equip"],
        equip_slot: "ranged",
        image : "gun"
    },
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
        tags: ["drink"],
        actions: ["drink","throw"],
        description: "A juice"
    },
    "juice_1" : {
        name: "Juice",
        image : "potion_2",
        tags: ["drink"],
        actions: ["drink","throw"],
        description: "A juice"
    },
    "juice_2" : {
        name: "Juice",
        image : "potion_3",
        tags: ["drink"],
        actions: ["drink","throw"],
        description: "A juice"
    },
    "juice_3" : {
        name: "Juice",
        image : "potion_4",
        tags: ["drink"],
        actions: ["drink","throw"],
        description: "A juice"
    },
    "data_chip_0" : {
        name: "Juice",
        image : "data_chip_0",
        actions: ["data"],
        description: "A data chip"
    },
    "data_chip_0" : {
        name: "Data Chip",
        image : "scroll_0",
        actions: ["use"],
        description: "scroll_0"
    },
    "data_chip_1" : {
        name: "Data Chip",
        image : "scroll_1",
        actions: ["use"],
        description: "A data chip"
    },
    "data_chip_2" : {
        name: "Data Chip",
        image : "scroll_2",
        actions: ["use"],
        description: "A data chip"
    },
    "data_chip_3" : {
        name: "Data Chip",
        image : "scroll_3",
        actions: ["use"],
        description: "A data chip"
    },
    "data_chip_4" : {
        name: "Data Chip",
        image : "scroll_4",
        actions: ["use"],
        description: "A data chip"
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