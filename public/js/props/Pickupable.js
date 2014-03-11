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
    if(action == "trash"){
        this.level.scene.player.removeInventory(this);
        this.level.scene.showInfoText(this.name+" trashed.");
        this.player.level.scene.inventoryDialog.show();
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
                    this.player.level.scene.showInfoText("Program installed: "+this.name);
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
        damage: 2,
        image : "bat",
        levels: [900,800,700,600,500,400,300,200,100,0]
    },
    "gun" : {
        name: "Gun",
        description: "A trusty gun",
        read_on_pickup: true,
        damage: 3,
        tags: ["ranged","weapon"],
        actions: ["equip"],
        equip_slot: "ranged",
        image : "gun",
        levels: [900,800,700,600,500,400,300,200,100,0]
    },
    "lab_note_1000" : {
        name: "Lab Note",
        description: "[CASCORP - Cybernetic and Artificial Systems Corporation]\n[System Administrator’s Note]\n[Date] 3/6/36 19:27\nWe have been seeing large usage spikes in our engineering services again. Mr. Yanatobi says not to worry, will run more diagnostics next week.\n[Published by Akimoto Nara]",
        read_on_pickup: true,
        actions: ["look at"],
        image : "lab_note",
        floor_name : "scrap of paper"
    },
    "lab_note_900" : {
        name: "Lab Note",
        description: "[CASCORP - Cybernetic and Artificial Systems Corporation] \nStage 1 Report\n[Date] 3/4/36 15:43\n[Test Subject] NU-11\n[Heart Rate] 160 BPM\n[Psychological Status] Unconscious\n[Summary] Subject has undergone the first stage of computer transfusion, and appears to be in a state of shock. Unlike previous subjects, she appears to have survived the transmission, but vital signs are volatile and must be monitored at all times. Second transfusion is scheduled to take place as soon as possible, once approval is gained by the board. If the subject survives, we will have our first chance to imprint her mind patterns into the Mainframe AI.",
        read_on_pickup: true,
        actions: ["look at"],
        image : "lab_note",
        floor_name : "scrap of paper"
    },
    "lab_note_800" : {
        name: "Lab Note",
        description: "[CASCORP - Cybernetic and Artificial Systems Corporation] \n[To] All CASCORP Employees\n[Sent] 3/8/36 11:34\n[Subject] Research Department Error\n[Contents]\nDear valued CASCORP Employees,\nAs you may have heard, there is a rumour circulating that the Research Department may have accidentally released experimental subjects, but we would like to dispel those rumours. The Research Department is currently experiencing some technical issues, but once we resume communications with our labs, we will assure you that nothing has escaped the lower floors of the building. Your safety is of utmost importance to us, so for your own protection we have placed the upper floors under lockdown. Thank you for your cooperation.\nYour CEO,\n	Mr. Yanatobi",
        read_on_pickup: true,
        actions: ["look at"],
        image : "lab_note",
        floor_name : "scrap of paper"
    },
    "lab_note_700" : {
        name: "Lab Note",
        description: "[CASCORP - Cybernetic and Artificial Systems Corporation]\nStage 2 Report\n[Date] 3/5/36 18:21\n[Test Subject] NU-11\n[Heart Rate] 75 BPM\n[Psychological Status] Stable\n[Summary] Subject has recovered from transfusions and seems to be adjusting to the AI imprinting. Additional tests will be run before the subject can be connected to the mainframe. Subject appears mentally stable, has successfully answered questions and completed simple tasks within our computer network. Subject also passed psychological tests earlier today, so it is only a matter of time before we connect NU-11 to the entire CASCORP network.",
        read_on_pickup: true,
        actions: ["look at"],
        image : "lab_note",
        floor_name : "scrap of paper"
    },
    "lab_note_600" : {
        name: "Lab Note",
        description: "[CASCORP - Cybernetic and Artificial Systems Corporation] \n[To] Sayo Kasahara, Financial Advisor\n[Date] 2/25/36 13:41\n[Subject] Additional Funds for Research\n[Contents]\nDear Kasahara-san\nWe have very much appreciated the funds that we have already been granted by the financial board to conduct our research on nanotechnology. However, the money has depleted faster than we imagined, so we ask from your generosity that our grant is extended. Our research into nanoviruses is the next frontier of modern warfare, allowing greater precision without the messy aftermath of chemical and nuclear weapons. The technology is still extremely volatile, and we need more time to develop an effective and lethal nanovirus.\nThank you for your consideration,\n	Kei Kitao",
        read_on_pickup: true,
        actions: ["look at"],
        image : "lab_note",
        floor_name : "scrap of paper"
    },
    "lab_note_500" : {
        name: "Lab Note",
        description: "[CASCORP - Cybernetic and Artificial Systems Corporation] \nTests for Clinical Insanity and Mental Incompetence\n[Date] 3/4/36 12:57\n[Test Subject] NU - 11\n[Psychological Tests Administered by Jiro Izanagi, Phd]\n[Notes] Subject responds to questions, appears dazed and confused but demonstrates rational thinking and clear-mindedness. Complains about inaudible noises and the subject has delineated that she is in pain, but appears to be handling the situation appropriately. Shows little empathy or feeling, most accurately can be described as emotionally distant. Scientist attribute this to the AI imprinting, and should be no cause for worry.\n[Subject NU-11 Passed Inspection]",
        read_on_pickup: true,
        actions: ["look at"],
        image : "lab_note",
        floor_name : "scrap of paper"
    },
    "lab_note_400" : {
        name: "Lab Note",
        description: "[CASCORP - Cybernetic and Artificial Systems Corporation] \n[To] Akimoto Nara, System Administrator\n[Sent] 3/5/36 10:23\n[Subject] Mainframe Access\n[Contents]\nAkimoto-san,\nThe recently implemented Mainframe-AI is requesting access to Research Department. Normally only the scientists directly involved with projects are given direct access, but with the new Mainframe I am unsure whether an exception should be made. I will await your reply before taking any action.\nSincerely,\n	Kei Kitao",
        read_on_pickup: true,
        actions: ["look at"],
        image : "lab_note",
        floor_name : "scrap of paper"
    },
    "lab_note_300" : {
        name: "Lab Note",
        description: "[CASCORP - Cybernetic and Artificial Systems Corporation] \n[To] Kei Kitao, Assistant Research Coordinator\n[Sent] 3/5/36 10:23\n[Subject] Re: Mainframe Access\n[Contents]\nHello Kitao-san,\nIf the Mainframe has passed psychological inspection, then surely it is ready for widespread use within the corporation. Give it full access to files and functions unless anyone above me says otherwise. I forwarded your message to Security, and they will contact you directly if they have any objections.\nSincerely,\n	Akimoto Nara",
        read_on_pickup: true,
        actions: ["look at"],
        image : "lab_note",
        floor_name : "scrap of paper"
    },
    "lab_note_200" : {
        name: "Lab Note",
        description: "[CASCORP - Cybernetic and Artificial Systems Corporation] \n[To] Kei Kitao, Assistant Research Coordinator\n[Sent] Message not sent; message saved to drafts folder\n[Subjects] Re: Fwd: Mainframe Access\n[Contents]\nKitao-san,\nThank you for asking about the Mainframe’s privileges. Unlike what our System Administrator told you, we advise you to immediately disconnect the Mainframe from all Research computers. The Mainframe is not yet verified to be bug-free and we need to be 100% sure that the Mainframe is stable enough to have access to some of the most dangerous materials in this corporation. Thank you for your email and we hope that this response reaches y\n[Message not sent; message saved to drafts folder] ",
        read_on_pickup: true,
        actions: ["look at"],
        image : "lab_note",
        floor_name : "scrap of paper"
    },
    "lab_note_100" : {
        name: "Lab Note",
        description: "[CASCORP - Cybernetic and Artificial Systems Corporation] \nPre-Experiment Questionnaire - NU-11\n[Name] Satoru Hayashi\n[Age] 22\n[Sex] Female\n[Occupation] Student at Tokyo University of Engineering\n[Medication] Asthma medication, prescribed sleep pills taken occasionally\n[Does your family have a history of heart disease?] No\n[Have you ever had depression or other mental illness?] No\n[Is there anything you would like the staff to know before we begin?] No",
        read_on_pickup: true,
        actions: ["look at"],
        image : "lab_note",
        floor_name : "scrap of paper"
    },
    "lab_note_0" : {
        name: "Lab Note",
        description: ".. what have we done",
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
        description: "Net Ninja virus program",
        program_name: "Net Ninja",
        tags: ["program"],
        actions: ["equip"],
        equip_slot: "program",
        image : "program_0",
        floor_name: "Net Ninja virus program",
        levels: [900,800,700,600,500,400,300,200,100,0]
    },
    "program_1" : {
        name: "Network Warrior",
        description: "Network Warrior virus program",
        program_name: "Network Warrior",
        tags: ["program"],
        actions: ["equip"],
        equip_slot: "program",
        image : "program_1",
        floor_name: "Network Warrior virus program",
        levels: [900,800,700,600,500,400,300,200,100,0]
    },
    "program_2" : {
        name: "Bit Shifter",
        description: "Bit Shifter worm program",
        program_name: "Bit Shifter",
        tags: ["program"],
        actions: ["equip"],
        equip_slot: "program",
        image : "program_2",
        floor_name: "Bit Shifter worm program",
        levels: [900,800,700,600,500,400,300,200,100,0]
    },
    "program_3" : {
        name: "SUDO Inspect",
        description: "SUDO Inspect ice breaker program",
        program_name: "SUDO Inspect",
        tags: ["program"],
        actions: ["equip"],
        equip_slot: "program",
        image : "program_3",
        floor_name: "SUDO Inspect ice breaker program",
        levels: [900,800,700,600,500,400,300,200,100,0]
    },
    "program_4" : {
        name: "Driver Corrupt",
        description: "Driver Corrupt program",
        program_name: "Driver Corrupt",
        tags: ["program"],
        actions: ["equip"],
        equip_slot: "program",
        image : "program_4",
        floor_name: "Driver Corrupt program",
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
    if(pi.actions){ p.actions = pi.actions;}
    p.actions.push("trash")
    if(pi.damage) {p.damage = pi.damage; }
    p.image = Resources.getImage(pi.image);
    return p;
}