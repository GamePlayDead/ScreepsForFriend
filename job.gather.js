var jobGather = {
    run: function(creep) {
        if(creep.memory.working == true && creep.carry.energy == 0){
            creep.memory.working = false;
        }
        else if(creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }
        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
        }
        if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        } else {
            if(creep.memory.working == false) {
                var source = Game.getObjectById(creep.memory.source);
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            } else {
                var targets = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                    filter: (s) => (s.structureType == STRUCTURE_EXTENSION
                                    || s.structureType == STRUCTURE_SPAWN) &&
                                        s.energy < s.energyCapacity
                    });
                if(targets != undefined) {
                    if(creep.transfer(targets, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets);
                    }
                } else {
                    creep.memory.upgrading = true;
                    if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller);
                    }
                }
            }
        }
    }
};

module.exports = jobGather;