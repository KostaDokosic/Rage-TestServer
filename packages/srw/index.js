
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
});