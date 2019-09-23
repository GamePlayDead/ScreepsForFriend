var jobBuilder = {
    run: function(creep) {
        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
        }

        if(creep.memory.building) {
            const target = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES);
            if(target) {
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            } else {
                var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    // the second argument for findClosestByPath is an object which takes
                    // a property called filter which can be a function
                    // we use the arrow operator to define it
                    filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL
                });

                // if we find one
                if (structure != undefined) {
                    // try to repair it, if it is out of range
                    if (creep.repair(structure) == ERR_NOT_IN_RANGE) {
                        // move towards it
                        creep.moveTo(structure);
                    }
                }
            }
        } else {
            var Storage1 = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: s => s.structureType == STRUCTURE_STORAGE && s.store[RESOURCE_ENERGY] < 1000000});
            if (creep.withdraw(Storage1, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                creep.moveTo(Storage1);
            }
            }
            if(creep.carry.energy == creep.carryCapacity){
                creep.memory.building = true
            }
    }
};

module.exports = jobBuilder;