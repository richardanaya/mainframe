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
    if(action == "throw"){
        this.level.scene.showInfoText("What do you want to throw at?");
        this.level.scene.select(function(x,y,obj){
            alert("okay "+x+" "+y);;
        })
    }
    if(action == "use"){
        if(this.id == "juice_0"){
            this.level.scene.showDialog("You gulp down the nanite infused liquid and feel stronger.",this.image);
            this.player.strength += 1;
            this.level.scene.showInfoText("Your strength is now "+this.player.strength)
        }
        else if(this.id == "ecig"){
            this.level.scene.showDialog("You pause a moment to take a smoke break and feel a bit sharper.",this.image);
            this.player.accuracy += 1;
            this.level.scene.showInfoText("Your accuracy is now "+this.player.accuracy);
        }
        else if(this.id == "data_chip_0"){
            this.level.scene.showDialog("You plug the data chip into your neckport and feel a rush of new knowledge.",this.image);
            this.player.mind += 1;
            this.level.scene.showInfoText("Your mind is now "+this.player.mind);
        }
        this.player.level.scene.processAllMoves();
        this.level.scene.player.removeInventory(this);
    }
    if(action == "equip"){
        if(this.equipped){
            this.equipped = false;
            this.player.level.scene.inventoryDialog.show();
            if(Pickupable.Items[this.id].equip_slot == "rig"){
                var items = this.player.getInventoryWithTag("program");
                for(var i = 0 ; i < items.length ; i++){
                    items[i].equipped = false;
                }
            }
            return;

        }

        if(Pickupable.Items[this.id].equip_slot == "program"){
            var wornRig = null;
            var rig = this.player.getInventoryWithTag("rig");
            for(var j = 0 ; j < rig.length; rig++){
                if(rig[j].equipped){
                    wornRig = rig[j];
                }
            }
            if(wornRig){
                var r = wornRig;
                var programs = this.player.getInventoryWithTag("program");
                var ct = 0;
                for(var k = 0 ; k < programs.length; k++){
                    if(programs[k].id == this.id && programs[k].equipped){
                        this.player.level.scene.showInfoText("Program already installed");
                        this.player.level.scene.inventoryDialog.show();
                        return;
                    }
                    if(programs[k].equipped){
                        ct++;
                    }
                }

                if(ct< Pickupable.Items[r.id].max_programs){
                    this.player.level.scene.showInfoText("Program installed");
                    this.equipped = true;
                }
                else {
                    this.player.level.scene.showInfoText("Your computer does not have any space left for program");
                }
            }
            else {
                this.player.level.scene.showInfoText("You need to wear a computer to install programs");
            }
            this.player.level.scene.inventoryDialog.show();
            return;
        }

        var items = this.player.getInventoryWithTag(Pickupable.Items[this.id].equip_slot);
        for(var i = 0 ; i < items.length ; i++){
            items[i].equipped = false;
        }
        this.equipped = true;
        if(Pickupable.Items[this.id].equip_slot == "rig"){
            var items = this.player.getInventoryWithTag("program");
            for(var i = 0 ; i < items.length ; i++){
                items[i].equipped = false;
            }
        }
        if(Pickupable.Items[this.id].equip_slot == "ranged"){
            this.player.useRanged(this);
        }
        if(Pickupable.Items[this.id].equip_slot == "melee"){
            this.player.useMelee(this);
        }
        this.player.level.scene.inventoryDialog.show();
    }
}

Pickupable.Items = {
    "bat" : {
        name: "Bat",
        description: "A long bat that looks ready to give a beating",
        read_on_pickup: true,
        tags: ["melee","weapon"],
        actions: ["equip"],
        equip_slot: "melee",
        image : "bat",
        levels: [900,800,700,600,500,400,300,200,100,0]
    },
    "gun" : {
        name: "Gun",
        description: "A trusty gun",
        read_on_pickup: true,
        tags: ["ranged","weapon"],
        actions: ["equip"],
        equip_slot: "ranged",
        image : "gun",
        levels: [900,800,700,600,500,400,300,200,100,0]
    },
    "lab_note_1000" : {
        name: "Lab Note: Sys Admin",
        description: "[System Administrators Note] We've been seeing large usage spikes in our engineering services again.  Mr. Yanatobi says not worry, will run more diagnostics next week",
        read_on_pickup: true,
        actions: ["look at"],
        image : "lab_note",
        floor_name : "scrap of paper"
    },
    "lab_note_900" : {
        name: "Lab Note: Sys Admin",
        description: "[System Administrators Note] We've been seeing large usage spikes in our engineering services again.  Mr. Yanatobi says not worry, will run more diagnostics next week",
        read_on_pickup: true,
        actions: ["look at"],
        image : "lab_note",
        floor_name : "scrap of paper"
    },
    "lab_note_800" : {
        name: "Lab Note: Sys Admin",
        description: "[System Administrators Note] We've been seeing large usage spikes in our engineering services again.  Mr. Yanatobi says not worry, will run more diagnostics next week",
        read_on_pickup: true,
        actions: ["look at"],
        image : "lab_note",
        floor_name : "scrap of paper"
    },
    "lab_note_700" : {
        name: "Lab Note: Sys Admin",
        description: "[System Administrators Note] We've been seeing large usage spikes in our engineering services again.  Mr. Yanatobi says not worry, will run more diagnostics next week",
        read_on_pickup: true,
        actions: ["look at"],
        image : "lab_note",
        floor_name : "scrap of paper"
    },
    "lab_note_600" : {
        name: "Lab Note: Sys Admin",
        description: "[System Administrators Note] We've been seeing large usage spikes in our engineering services again.  Mr. Yanatobi says not worry, will run more diagnostics next week",
        read_on_pickup: true,
        actions: ["look at"],
        image : "lab_note",
        floor_name : "scrap of paper"
    },
    "lab_note_500" : {
        name: "Lab Note: Sys Admin",
        description: "[System Administrators Note] We've been seeing large usage spikes in our engineering services again.  Mr. Yanatobi says not worry, will run more diagnostics next week",
        read_on_pickup: true,
        actions: ["look at"],
        image : "lab_note",
        floor_name : "scrap of paper"
    },
    "lab_note_400" : {
        name: "Lab Note: Sys Admin",
        description: "[System Administrators Note] We've been seeing large usage spikes in our engineering services again.  Mr. Yanatobi says not worry, will run more diagnostics next week",
        read_on_pickup: true,
        actions: ["look at"],
        image : "lab_note",
        floor_name : "scrap of paper"
    },
    "lab_note_300" : {
        name: "Lab Note: Sys Admin",
        description: "[System Administrators Note] We've been seeing large usage spikes in our engineering services again.  Mr. Yanatobi says not worry, will run more diagnostics next week",
        read_on_pickup: true,
        actions: ["look at"],
        image : "lab_note",
        floor_name : "scrap of paper"
    },
    "lab_note_200" : {
        name: "Lab Note: Sys Admin",
        description: "[System Administrators Note] We've been seeing large usage spikes in our engineering services again.  Mr. Yanatobi says not worry, will run more diagnostics next week",
        read_on_pickup: true,
        actions: ["look at"],
        image : "lab_note",
        floor_name : "scrap of paper"
    },
    "lab_note_100" : {
        name: "Lab Note: Sys Admin",
        description: "[System Administrators Note] We've been seeing large usage spikes in our engineering services again.  Mr. Yanatobi says not worry, will run more diagnostics next week",
        read_on_pickup: true,
        actions: ["look at"],
        image : "lab_note",
        floor_name : "scrap of paper"
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
        name: "MuscleBoost",
        image : "potion_1",
        actions: ["use","throw"],
        description: "This potion is a devastating steroid cocktail of muscle fiber inducing nanites.",
        levels: [900,800,700,600,500,400,300,200,100,0]
    },
    "juice_1" : {
        name: "Juice",
        image : "potion_2",
        actions: ["use","throw"],
        description: "A juice",
        levels: [900,800,700,600,500,400,300,200,100,0]
    },
    "juice_2" : {
        name: "Juice",
        image : "potion_3",
        actions: ["use","throw"],
        description: "A juice",
        levels: [900,800,700,600,500,400,300,200,100,0]
    },
    "juice_3" : {
        name: "Juice",
        image : "potion_4",
        actions: ["use","throw"],
        description: "A juice",
        levels: [900,800,700,600,500,400,300,200,100,0]
    },
    "data_chip_0" : {
        name: "Juice",
        image : "data_chip_0",
        actions: ["data"],
        description: "A data chip",
        levels: [900,800,700,600,500,400,300,200,100,0]
    },
    "data_chip_0" : {
        name: "Data Chip",
        image : "scroll_0",
        actions: ["use"],
        description: "scroll_0",
        levels: [900,800,700,600,500,400,300,200,100,0]
    },
    "data_chip_1" : {
        name: "Information Overload",
        image : "scroll_1",
        actions: ["use"],
        description: "This data chip contains a library of data directly compatible with your nueral systems.",
        levels: [900,800,700,600,500,400,300,200,100,0]
    },
    "data_chip_2" : {
        name: "Data Chip",
        image : "scroll_2",
        actions: ["use"],
        description: "A data chip",
        levels: [900,800,700,600,500,400,300,200,100,0]
    },
    "data_chip_3" : {
        name: "Data Chip",
        image : "scroll_3",
        actions: ["use"],
        description: "A data chip",
        levels: [900,800,700,600,500,400,300,200,100,0]
    },
    "data_chip_4" : {
        name: "Data Chip",
        image : "scroll_4",
        actions: ["use"],
        description: "A data chip",
        levels: [900,800,700,600,500,400,300,200,100,0]
    },
    "ecig" : {
        name: "Electric Cigarette",
        image : "ecig",
        actions: ["use"],
        description: "An electric cigarette. A smoke break would be nice right now.",
        levels: [900,800,700,600,500,400,300,200,100,0]
    },
    "hackable_computer" : {
        name: "Hackable Computer",
        image : "hackable_computer_office",
        actions: ["use"],
        floor_name: "computer you can hack",
        description: "",
        levels: [900,800,700,600,500,400,300,200,100,0]
    },
    "rig_0" : {
        name: "HaxMark 5",
        description: "You find a computer rig for accessing networks with (2 program capacity)",
        read_on_pickup: true,
        tags: ["rig"],
        max_programs: 2,
        actions: ["equip","look at"],
        equip_slot: "rig",
        image : "rig_0",
        floor_name: "computer rig",
        levels: [900,800,700,600,500,400,300,200,100,0]
    },
    "program_0" : {
        name: "Net Ninja",
        description: "You find a computer program",
        program_name: "Net Ninja",
        tags: ["program"],
        actions: ["equip"],
        equip_slot: "program",
        image : "program_0",
        floor_name: "program data chip",
        levels: [900,800,700,600,500,400,300,200,100,0]
    },
    "program_1" : {
        name: "Network Warrior",
        description: "You find a computer program",
        program_name: "Network Warrior",
        tags: ["program"],
        actions: ["equip"],
        equip_slot: "program",
        image : "program_1",
        floor_name: "program data chip",
        levels: [900,800,700,600,500,400,300,200,100,0]
    },
    "program_2" : {
        name: "Bit Shifter",
        description: "You find a computer program",
        program_name: "Bit Shifter",
        tags: ["program"],
        actions: ["equip"],
        equip_slot: "program",
        image : "program_2",
        floor_name: "program data chip",
        levels: [900,800,700,600,500,400,300,200,100,0]
    },
    "program_3" : {
        name: "SUDO Inspect",
        description: "You find a computer program",
        program_name: "SUDO Inspect",
        tags: ["program"],
        actions: ["equip"],
        equip_slot: "program",
        image : "program_3",
        floor_name: "program data chip",
        levels: [900,800,700,600,500,400,300,200,100,0]
    },
    "program_4" : {
        name: "Driver Corrupt",
        description: "You find a computer program",
        program_name: "Driver Corrupt",
        tags: ["program"],
        actions: ["equip"],
        equip_slot: "program",
        image : "program_4",
        floor_name: "program data chip",
        levels: [900,800,700,600,500,400,300,200,100,0]
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