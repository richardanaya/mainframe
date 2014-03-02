var Flags = function(){

}

Flags.flags = {};

Flags.flag = function(name){
    if(Flags.flags[name]){
        return false;
    }
    else {
        Flags.flags[name] = true;
        return true;
    }
}