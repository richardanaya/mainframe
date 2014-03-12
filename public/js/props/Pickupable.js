var Pickupable = function(){
    this.x = 0;
    this.y = 0;
    this.image = Resources.images.up_elevator;
    this.tags = ["item"];
    this.id = "";
    this.equipped = false;
    this.actions = [];
}

var randomizedPotionList = {};
Pickupable.randomizePotionList = function() {
    var effects = [
        { effect: function( player ) {
            player.health = player.maxHealth;
            player.level.scene.showInfoText("You feel warm and tingly inside.");
          },
          description: "A rejuvination mixture of herbs and spices that tastes like gummy bears and tang.  Fully restores health",
          used: false,
        
        },
        { effect: function( player ) {
            player.poisonCount = 10;
            player.level.scene.showInfoText("It tastes like mayonaise left out in the sun..");
          } ,
          description: "A foul smelling chemical substrate that boils your inside, causes life threatening dysentery.",
          used: false,
        },
        { effect: function( player ) {
            player.camoCount = 200;
            player.level.scene.showInfoText(this.name+" becomes one with the matrix.");
          },
          description: "A mind altering nano drug that not only changes your perception but that of those around you.  Grants active stealth camoflauge for a period of time.",
          used: false,
        },
        { effect: function( player ) {
            player.strength += Utilities.randRangeInt( 0, 3 );
            player.level.scene.showInfoText("Breakfast of champions!");
          } ,
          description: "A fortifying blend of whole grain oats and caffine.  Permanently improves strength.",
          used: false,
        },
    ];

    var randomized = Utilities.shuffleArray( effects );
    for( var i = 0; i < randomized.length; ++i ) {
        randomizedPotionList[ 'juice_'+i.toString() ] = randomized[i];
    }
}

Pickupable.prototype = Object.create(GameObject.prototype);

Pickupable.prototype.onObjectEnter = function(o){

}

Pickupable.prototype.onAction = function(action){
    var _this = this;
    if(action == "look at"){
        if( this.level == null || this.level == undefined ) this.level = this.player.level;
        if( randomizedPotionList[ this.id ] == undefined || randomizedPotionList[ this.id ].used == false ) {
            this.level.scene.showDialog(this.description,this.image);
        }
        else {
            this.level.scene.showDialog( randomizedPotionList[ this.id ].description,this.image);
        }
    }
    if(action == "trash"){
        this.player.removeInventory(this);
        this.player.level.scene.showInfoText(this.name+" trashed.");
        this.player.level.scene.inventoryDialog.show();
    }
    if(action == "throw"){
        this.level.scene.showInfoText("What do you want to throw at?");
        this.level.scene.select(function(x,y,obj){
            alert("okay "+x+" "+y);;
        })
    }
    if(action == "use"){
        if( randomizedPotionList[ this.id ] != undefined ) {
            randomizedPotionList[ this.id ].effect( this.player );
            randomizedPotionList[ this.id ].used = true;
        }
        else if(this.id == "ecig"){
            this.level.scene.showDialog("You pause a moment to take a smoke break and feel a bit sharper.",this.image);
            this.player.accuracy += 1;
            this.level.scene.showInfoText("Your accuracy is now "+this.player.accuracy);
        }
        else if(this.id == "data_chip_atk"){
            this.level.scene.showInfoText("Your strikes will be as precise as they are merciless.");
            this.player.damage += 1;
        }
        else if(this.id == "data_chip_arm"){
            this.level.scene.showInfoText("They will break themselves upon you.");
            this.player.armor += 1;
        }
        else if(this.id == "data_chip_acc"){
            this.level.scene.showInfoText("Nothing will escape once you've set your sights in.");
            this.player.strength += 1;
        }
        else if(this.id == "data_chip_eva"){
            this.level.scene.showInfoText("You will see it coming a mile away...");
            this.player.defense += 1;
        }
        else if(this.id == "data_chip_id"){
            this.level.scene.showInfoText("Hmm... it appears the developer didn't complete this feature.");
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
        if(Pickupable.Items[this.id].equip_slot == "face"){
            this.player.faceItem = this;
        }
        this.player.level.scene.inventoryDialog.show();
    }
}

Pickupable.Items = {
    "mirror_shades" : {
        name: "Mirrored Shades",
        description: "Mirror Shades\n[GLASSES]\nTheses intimidating sunglasses give a whole new meaning to 'dressed to kill'.",
        read_on_pickup: true,
        tags: ["glasses"],
        actions: ["equip","look at"],
        equip_slot: "face",
        image: "mirror_shades",
        levels: [900,800,700,600,500,400,300,200,100,0],
    },
    "bat" : {
        name: "Bat",
        description: "Bat\n[DMG:1][MELEE]\nA long bat that looks ready to give a beating",
        read_on_pickup: true,
        tags: ["melee","weapon"],
        actions: ["equip","look at"],
        equip_slot: "melee",
        damage: 1,
        image : "bat",
        levels: [900,800,700,600,500,400,300,200,100,0]
    },
    "cricket_bat" : {
        name: "Cricket Bat",
        description: "Cricket Bat\n[DMG:2][MELEE]\nA broad flat plank of wood with a handle.  Archeologists assume it was used for bizarre initiation rituals in the distant human past.",
        read_on_pickup: true,
        tags: ["melee","weapon"],
        actions: ["equip","look at"],
        equip_slot: "melee",
        damage: 2,
        image : "item_cricket_bat",
        levels: [900,800,700,600,500,400,300,200,100,0]
    },
    "golf_club" : {
        name: "Golf Club",
        description: "Golf Club\n[DMG:1][MELEE][STUN:25%]\nA titaniam baton with a wedge shaped head, likely originally owned by an overpaid executive.",
        read_on_pickup: true,
        tags: ["melee","weapon"],
        actions: ["equip","look at"],
        equip_slot: "melee",
        damage: 1,
        stunChance: 0.25,
        image : "item_golf_club",
        levels: [900,800,700,600,500,400,300,200,100,0]
    },
    "samurai_sword" : {
        name: "Samurai Sword",
        description: "Samurai Sword\n[DMG:3][MELEE][BLEED]\nAn expensive imported Japanese samurai sword, especially powerful in the hands of an experienced swordsman, with bonus damage to unarmored targets.",
        read_on_pickup: true,
        tags: ["melee","weapon","samurai","fleshflayer"],
        actions: ["equip","look at"],
        equip_slot: "melee",
        damage: 3,
        image : "item_samurai_sword",
        levels: [900,800,700,600,500,400,300,200,100,0]
    }
    ,
    "pipe" : {
        name: "Pipe",
        description: "Pipe\n[DMG:2][MELEE]\nA sturdy and reliable makeshift cludgel.",
        read_on_pickup: true,
        tags: ["melee","weapon"],
        actions: ["equip","look at"],
        equip_slot: "melee",
        damage: 2,
        image : "item_pipe",
        levels: [900,800,700,600,500,400,300,200,100,0]
    }
    ,
    "butterfly_knife" : {
        name: "Butterfly Knife",
        description: "Butterfly Knife\n[DMG:2][MELEE][BLEED]\nThe favored weapon of coordinated dancing street gangs, causes bleeding wounds to unarmored targets.",
        read_on_pickup: true,
        tags: ["melee","weapon","fleshflayer"],
        actions: ["equip","look at"],
        equip_slot: "melee",
        damage: 2,
        image : "item_butterfly_knife",
        levels: [900,800,700,600,500,400,300,200,100,0]
    },
    "cobra" : {
        name: "Cobra",
        description: "Cobra\n[DMG:2][MELEE][STUN:30%]\nAn extendable baton with an electrode on the end, compact and especially effective against college students and protestors.",
        read_on_pickup: true,
        tags: ["melee","weapon"],
        actions: ["equip", "look at"],
        equip_slot: "melee",
        damage: 2,
        stunChance: 0.3,        
        image : "item_cobra",
        levels: [900,800,700,600,500,400,300,200,100,0]
    }

    ,
    "boxing gloves" : {
        name: "Boxing Gloves",
        description: "Boxing Gloves\n[DMG:1][MELEE][STUN:40%]\nA weighted pair of gloves that doesn't deal much damage but useful for throwing a knockout punch.",
        read_on_pickup: true,
        tags: ["melee","weapon"],
        actions: ["equip", "look at"],
        equip_slot: "melee",
        damage: 1,
        stunChance: 0.4,
        image : "item_boxing_gloves",
        levels: [900,800,700,600,500,400,300,200,100,0]
    },
    "chain" : {
        name: "Chain",
        description: "Chain\n[DMG:2][MELEE][STUN:20%]\nEven when not riding on your lightbike, this series of connected metal rings still makes a simple but fearsome weapon.",
        read_on_pickup: true,
        tags: ["melee","weapon"],
        actions: ["equip", "look at"],
        equip_slot: "melee",
        damage: 2,
        stunChance: 0.2,
        image : "item_chain",
        levels: [900,800,700,600,500,400,300,200,100,0]
    },
    "taser" : {
        name: "Taser",
        description: "Taser\n[DMG:1][MELEE][MALFUNCTION][STUN:60%]\nUseful for incapcatating your target for a quick getaway, can also be used to fry the electrical components on various droids.",
        read_on_pickup: true,
        tags: ["melee","weapon","robokiller"],
        actions: ["equip", "look at"],
        equip_slot: "melee",
        damage: 1,
        image : "item_taser",
        stunChance: 0.6,
        levels: [900,800,700,600,500,400,300,200,100,0]
    },
    "gun" : {
        name: "Pistol",
        description: "Pistol\n[DMG:1][RNG]\nA standard sidearm, useful for engaging enemies from a distance.",
        read_on_pickup: true,
        damage: 1,
        tags: ["ranged","weapon","bullet"],
        actions: ["equip","look at"],
        equip_slot: "ranged",
        image : "gun",
        levels: [900,800,700,600,500,400,300,200,100,0]
    },
    "shotgun" : {
        name: "Shotgun",
        description: "Shotgun\n[DMG:3][RNG]\nFires a havey slug useful against armored and unarmored foes alike.",
        read_on_pickup: true,
        damage: 2,
        tags: ["ranged","weapon","spread"],
        actions: ["equip","look at"],
        equip_slot: "ranged",
        image : "item_shotgun",
        levels: [900,800,700,600,500,400,300,200,100,0]
    },
    "pulse_laser" : {
        name: "Pulse Laser",
        description: "Pulse Laser\n[DMG:4][RNG][MALFUNCTION]\nA complicated prototype laser weapon that emits EMF which can cause malfunctions in nearby machinery.  Due to it's prototypical nature, it can only be fully utilized by those with a PhD in Advanced Physics.",
        read_on_pickup: true,
        damage: 4,
        tags: ["ranged","weapon","laser","scientist","robokiller"],
        actions: ["equip", "look at"],
        equip_slot: "ranged",
        image : "item_pulse_laser",
        levels: [900,800,700,600,500,400,300,200,100,0]
    },
    "flachette_gun" : {
        name: "Flachette Gun",
        description: "Flachette Gun\n[DMG:2][RNG][BLEED]\nA favored weapon of the stealthy, this weapon fires projectiles with silent bursts of air, and the needle sharp projectiles can cause lasting internal injuries if left untreated.",
        read_on_pickup: true,
        damage: 2,
        tags: ["ranged","weapon","bullet","hacker","fleshflayer"],
        actions: ["equip", "look at"],
        equip_slot: "ranged",
        image : "item_flachette_gun",
        levels: [900,800,700,600,500,400,300,200,100,0]
    },
    "uzi" : {
        name: "Uzi",
        description: "Uzi\n[DMG:3][RNG][BLEED]\nWhile difficult to aim even with small calibur bullets, when it connects this weapon often leaves it's targets looking like swiss cheese.",
        read_on_pickup: true,
        damage: 3,
        tags: ["ranged","weapon","spread","fleshflayer"],
        actions: ["equip", "look at"],
        equip_slot: "ranged",
        image : "item_uzi",
        levels: [900,800,700,600,500,400,300,200,100,0]
    },
    "mini_gun" : {
        name: "Mini Gun",
        description: "Mini Gun\n[DAM:5][RNG][BLEED][EPIC]\nWhether dealing with lightly armored vehicles or looking for a fun but expensive way to clear some forest, this heavy hand held fully automatic cannon is a fearsome weapon.",
        read_on_pickup: true,
        damage: 5,
        tags: ["ranged","weapon","spread","epic","fleshflayer"],
        actions: ["equip","look at"],
        equip_slot: "ranged",
        image : "item_mini_gun",
        levels: []
    },
    "plasma_lance" : {
        name: "Plasma Lance",
        description: "Plasma Lance\n[DMG:6][RNG][EPIC]\nThis prototype plasma lance was originally developed for offworld deep core mining, but it cuts through bodies just as well.  Someone with an intimate understanding of particle physics might get more out of this gun.",
        read_on_pickup: true,
        damage: 6,
        tags: ["ranged","weapon","plasma","scientist","epic"],
        actions: ["equip", "look at"],
        equip_slot: "ranged",
        image : "item_plasma_lance",
        levels: []
    },
    "masamune" : {
        name: "Legendary Masamune",
        description: "Legendary Masamune\n[DMG:10][MELEE][EPIC]\nA Japanese national treasure, thought to be on display at the Museum of Natural history in Kyoto.  This finely crafted weapon is even more deadly in the hands of a trained swordsman.",
        read_on_pickup: true,
        tags: ["melee","weapon","samurai","fleshflayer","epic"],
        actions: ["equip", "look at"],
        equip_slot: "melee",
        damage: 10,
        image : "item_masamune",
        levels: []
    },
    "laser_whip" : {
        name: "Laser Whip",
        description: "Laser Whip\n[DMG:6][MELEE][MALFUNCTION][EPIC]\nDiscovered on accident by a hacker improving on their netsecurity, this weapon functions using the same principles of hack backtrace feedback damage.",
        read_on_pickup: true,
        tags: ["melee","weapon","robokiller","hacker","epic"],
        actions: ["equip", "look at"],
        equip_slot: "melee",
        damage: 6,
        image : "item_laser_whip",
        levels: []
    },

    "janitors_note" : {
        name: "Lab Note",
        description: "[CASCORP - Cybernetic and Artificial Systems Corporation]\n[Janitorial Staff]\,\nNotice to janitorial crew. Bioenhancment liquids have been placed in the safe for worker use.  You all know the code. Be sure not to drink too much, you all remember what happened last time. I don't want to be sending anyone down to lab to pump their guts.\n Has anyone noticed how quiet the building has been today?\nSahe",
        read_on_pickup: true,
        actions: ["look at"],
        image : "lab_note",
        floor_name : "scrap of paper"
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
        description: "[CASCORP - Cybernetic and Artificial Systems Corporation] \n[To] Akimoto Nara, System Administrator\n[Sent] 3/5/36 10:23\n[Subject] Mainframe Access\n[Contents]\nAkimoto-san,\nThe recently implemented Mainframe-AI is requesting access to the Research Department. Normally only the scientists directly involved with projects are given direct access, but with the new Mainframe I am unsure whether an exception should be made. I will await your reply before taking any action.\nSincerely,\n	Kei Kitao",
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
        read_on_pickup: true,
        description: "A keycard that looks like it can be used at corporate level.  Perhaps this can open something?"
    },

    "juice_0" : {
        name: "Blue Potion",
        image : "potion_1",
        actions: ["use","look at"],
        description: "A strange smelling blue concoction contained in a laboratory beaker.  Who knows what it'll do?",
        levels: [900,800,700,600,500,400,300,200,100,0]
    },
    "juice_1" : {
        name: "Yellow Potion",
        image : "potion_2",
        actions: ["use","look at"],
        description: "A strange smelling yellow brew contained in a laboratory beaker.  Who knows what it'll do?",
        levels: [900,800,700,600,500,400,300,200,100,0]
    },
    "juice_2" : {
        name: "Red Potion",
        image : "potion_3",
        actions: ["use","look at"],
        description: "A red liquid contained in a laboratory beaker.  It looks carbonated. Who knows what it'll do?",
        levels: [900,800,700,600,500,400,300,200,100,0]
    },
    "juice_3" : {
        name: "Green Potion",
        image : "potion_4",
        actions: ["use","look at"],
        description: "An unnaturaly green substance contained in a laboratory beaker.  Who knows what it'll do?",
        levels: [900,800,700,600,500,400,300,200,100,0]
    },
    "data_chip_atk" : {
        name: "Neural Stabilization Firmware Upgrade",
        image : "scroll_0",
        actions: ["use","look at"],
        description: "This data chip contains a new firmware for your hand/eye module. It improves general steadiness and coordination of your limbs, granting a permanent attack boost.",
        levels: [900,800,700,600,500,400,300,200,100,0]
    },
    "data_chip_arm" : {
        name: "Nanoweave Pattern Optimization",
        image : "scroll_1",
        actions: ["use","look at"],
        description: "This chip contains an improved nanoweave fiber pattern for your skin, granting a permanent armor boost.",
        levels: [900,800,700,600,500,400,300,200,100,0]
    },
    "data_chip_acc" : {
        name: "Optics Diagnostic with Unit Tests",
        image : "scroll_2",
        actions: ["use","look at"],
        description: "A data chip containing an open source optical recalibration sequence, with unit tests so you know it's good.  It grants a permanent accuracy boost.",
        levels: [900,800,700,600,500,400,300,200,100,0]
    },
    "data_chip_eva" : {
        name: "Avoidance Algorithm",
        image : "scroll_3",
        actions: ["use","look at"],
        description: "A data chip with a faster and more reliable evasion algorithm.  Improves a permanent evasion boost. ",
        levels: [900,800,700,600,500,400,300,200,100,0]
    },
    "data_chip_id" : {
        name: "Photo Spetrometer",
        image : "scroll_4",
        actions: ["use","look at"],
        description: "Used to identify the compounds within a substance giving insight into even the most complicated checmical brew.",
        levels: [900,800,700,600,500,400,300,200,100,0]
    },
    "ecig" : {
        name: "Electric Cigarette",
        image : "ecig",
        actions: ["use","look at"],
        description: "An electric cigarette. A smoke break would be nice right now.",
        levels: [900,800,700,600,500,400,300,200,100,0]
    },
    "hackable_safe" : {
        name: "Hackable Computer",
        image : "hackable_safe",
        floor_name: "A computer gaurded safe",
        description: "",
        levels: [900,800,700,600,500,400,300,200,100,0]
    },
    "rig_0" : {
        name: "HaxMark 5 Computer",
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
    "rig_1" : {
        name: "Ed's Eyes Computer",
        description: "You find a computer rig for accessing networks with (3 program capacity)",
        read_on_pickup: true,
        tags: ["rig"],
        max_programs: 3,
        actions: ["equip","look at"],
        equip_slot: "rig",
        image : "rig_1",
        floor_name: "computer rig",
        levels: [900,800,700,600,500,400,300,200,100,0]
    },
    "rig_2" : {
        name: "Ono Sendai Cyberspace 7 Computer",
        description: "You find a computer rig for accessing networks with (4 program capacity)",
        read_on_pickup: true,
        tags: ["rig"],
        max_programs: 4,
        actions: ["equip","look at"],
        equip_slot: "rig",
        image : "rig_2",
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
    },
    "sop13" : {
        name: "SOP13 Drone",
        description: "Security Oriented Protection Drone Rev 13.  Every scientists best friend, the perfect companion except she barks at the pizza delivery boy.",
        tags: ["ally"],
        actions: ["look at"],
        image : "sop13_1",
        levels: []
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
    if(pi.actions){
        p.actions = pi.actions;
    }

    p.stunChance = pi.stunChance == undefined ? 0 : pi.stunChance;

    if(pi.damage) {p.damage = pi.damage; }
    if(p.actions.indexOf("trash")==-1){
        p.actions.push("trash")
    }
    p.image = Resources.getImage(pi.image);
    return p;
}

Pickupable.getEpicItems = function() {
   var result = [];
    for( var key in Pickupable.Items ) {
        var item = Pickupable.Items[key];
        if( item != null && item != undefined && item.tags != undefined && item.tags != null && item.tags.indexOf( "epic" ) != -1  )
            result.push( key );
    }

    return result;
}

Pickupable.loadRandomEpicLootItem = function() {
    var epicItems = Pickupable.getEpicItems();
    var randIndex = Utilities.randRangeInt(0,epicItems.length);
    var randItemKey = epicItems[ randIndex ];
    return Pickupable.load( randItemKey );
}