var jobGather = require('job.gather');
var jobBuilder = require('job.builder');
var toolsBuilds = require('tools.builds');
var toolsCreepNumbers = require('tools.creepNumbers');
var jobLgatherer = require("Job.Lgatherer");
var jobLGathererCon = require("Job.LGathererCon");

/*
    ROLES: [(W)orker,(G)uard]
    JOBS: [(G)ather (Gather or upgrade),(B)uilder (Build or repair),(A)ttack,(R)ange]
*/

module.exports.loop = function () {

    var gatherCount = 0
    var buildCount = 0
    var defenderCount = 0
    var LGatherer = 0
    var LGathererCon = 0
    var controllerLevel = Game.spawns['Spawn1'].room.controller.level - 1
    var spawning = false
    var HOME = "W3N8"

    // find all Towers
    var towers = _.filter(Game.structures, s => s.structureType == STRUCTURE_TOWER);
    // for each tower
    for (let tower of towers) {
        // find close hostile creep
        var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        // if target is found
        if (target != undefined) {
            // attack it
            tower.attack(target);
        }
        // if creep not on max health
        else {

            //....first heal any damaged creeps
            for (let name in Game.creeps) {
                // get the creep object
                var creep = Game.creeps[name];
                if (creep.hits < creep.hitsMax) {
                    towers.forEach(tower => tower.heal(creep));
                    console.log("Tower is healing Creeps.");
                }
            }


            for (var name in Memory.creeps) {
                if (!Game.creeps[name]) {
                    delete Memory.creeps[name];
                } else {
                    var creep = Game.creeps[name];
                    if (creep.spawning) {
                        spawning = true
                    } else {
                        switch (creep.memory.job) {
                            case 'gather':
                                gatherCount++
                                jobGather.run(creep);
                                break;
                            case 'builder':
                                buildCount++
                                jobBuilder.run(creep);
                                break;
                            case 'defender':
                                defenderCount++
                                break;
                            case "LGatherer":
                                LGatherer++
                                jobLgatherer.run(creep);
                                break;
                            case "LGathererCon":
                                LGathererCon++
                                jobLGathererCon.run(creep);

                        }
                    }
                }
            }
            if (!spawning) {
                if (gatherCount < toolsCreepNumbers.gather[controllerLevel]) {
                    var energySource = ''
                    var energySources = Game.spawns['Spawn1'].room.find(FIND_SOURCES)
                    var lastEnergySourceIndex = Game.spawns['Spawn1'].memory.lastEnergySourceIndex
                    if (lastEnergySourceIndex == undefined || lastEnergySourceIndex == energySources.length - 1) {
                        energySource = energySources[0].id
                        Game.spawns['Spawn1'].memory.lastEnergySourceIndex = 0
                    } else {
                        energySource = energySources[lastEnergySourceIndex + 1].id
                        Game.spawns['Spawn1'].memory.lastEnergySourceIndex++;
                    }

                    Game.spawns['Spawn1'].spawnCreep(toolsBuilds.worker[controllerLevel], 'WG' + Game.time, {
                        memory: {
                            job: 'gather',
                            source: energySource,
                            upgrading: false,
                            working: false
                        }
                    });
                } else if (buildCount < toolsCreepNumbers.builder[controllerLevel]) {
                    Game.spawns['Spawn1'].spawnCreep(toolsBuilds.worker[controllerLevel], 'WB' + Game.time, {memory: {job: 'builder', building: false}});
                } else if (LGatherer < toolsCreepNumbers.LGathere[controllerLevel]) {
                    Game.spawns["Spawn1"].spawnCreep(toolsBuilds.LWorker[controllerLevel], "LG" + Game.time, {memory: {job: "LGatherer", working: false, home: HOME, target: "W3N7"}});
                } else if (LGathererCon < toolsCreepNumbers.LGathererCon[controllerLevel]) {
                    Game.spawns["Spawn1"].spawnCreep(toolsBuilds.LWorker[controllerLevel], "LGC" + Game.time, {memory: {job: "LGathererCon", working: false, home: HOME, target: "W2N8"}});
                }

            }
        }
    }
}