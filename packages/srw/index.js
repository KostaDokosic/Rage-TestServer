const fs = require('fs');

mp.events.add('playerCommand', (player, command) => {
    let arr = command.split(' ');
    if (arr[0] == 'weapon') {
        player.giveWeapon([mp.joaat('weapon_machinepistol'), mp.joaat('weapon_minismg')], 1000);
    }
    else if (arr[0] == 'veh') {
        let pos = player.position;
        pos.x += 2;
        pos.y += 2;
        let v = mp.vehicles.new(mp.joaat(arr[1]), pos, { dimension: player.dimension });
        v.setColor(Math.floor(Math.random() * 111), Math.floor(Math.random() * 111));
    }
    else if(arr[0] == 'setped' || arr[0] == 'setskin') {
        player.model = mp.joaat(arr[1]);
    }
});

mp.events.add('save:position', (player, data) => {
    data = JSON.parse(data);
    data = `${data.pos}\n${data.head}\n${data.camPos}\n${data.camRot}\n${data.camDirect}\n${data.hit}\n---------------------------------------------\n\n\n`
    fs.appendFile('kordinate.txt', data, (error) => {
        if (err) throw err;
        console.log('Kordinate sacuvane!');
        player.outputChatBox('Kordinate sacuvane!');
    });
});

mp.events.add('packagesLoaded', () => {
    //OVDE NALEPI REMOVE IPL
});

require('./exitHandler.js');