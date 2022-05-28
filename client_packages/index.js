require('./noclip');
require('./charcreator');

let render;
const gameplayCam = mp.cameras.new('gameplay');

mp.events.add("playerCommand", (command) => {
	const args = command.split(/[ ]+/);
	const commandName = args[0];

	args.shift();
		
	if (commandName === "save") {
        let camPos = gameplayCam.getCoord();
        let camRot = gameplayCam.getRot(2);
        let camDirect = gameplayCam.getDirection();

		let pos = `Player Position: new mp.Vector3(${localPlayer.position.x.toFixed(4)}, ${localPlayer.position.y.toFixed(4)}, ${localPlayer.position.z.toFixed(4)})`;
		let head = `Player Heading: ${localPlayer.getHeading().toFixed(4)}`;
        camPos = `Camera Position: new mp.Vector3(${camPos.x.toFixed(4)}, ${camPos.y.toFixed(4)}, ${camPos.z.toFixed(4)})`;
        camRot = `Camera Rotation: new mp.Vector3(${camRot.x.toFixed(4)}, ${camRot.y.toFixed(4)}, ${camRot.z.toFixed(4)})`;
        camDirect = `Camera Direction: new mp.Vector3(${camDirect.x.toFixed(4)}, ${camDirect.y.toFixed(4)}, ${camDirect.z.toFixed(4)})`;
        let hit = pointingAt(100);
        if(hit != undefined) {
            hit = `Raycast: new mp.Vector3(${hit.position.x.toFixed(4)}, ${hit.position.y.toFixed(4)}, ${hit.position.z.toFixed(4)})`;
        }

        let data = JSON.stringify({ pos: pos, head: head, camPos: camPos, camRot: camRot, camDirect: camDirect, hit: hit });
        mp.events.callRemote('save:position', data);
	}
});

function pointingAt(distance) {
    const camera = mp.cameras.new("gameplay")
    let position = camera.getCoord(); 
    let direction = camera.getDirection();
    let farAway = new mp.Vector3((direction.x * distance) + (position.x), (direction.y * distance) + (position.y), (direction.z * distance) + (position.z));
    let result = mp.raycasting.testPointToPoint(position, farAway, null, 17);
    return result;
}

mp.events.add('playerReady', () => {
    render = new mp.Event('render', () => {
        mp.game.graphics.drawText(`Position: X: ${localPlayer.position.x.toFixed(4)}  Y: ${localPlayer.position.y.toFixed(4)}  Z: ${localPlayer.position.z.toFixed(4)}  H: ${localPlayer.getHeading().toFixed(4)}`, [0.5, 0], {
            font: 0,
            color: [255, 255, 255, 255],
            scale: [0.4, 0.4],
            outline: true,
            centre: false
        });
        const camPos = gameplayCam.getCoord();
        const camRot = gameplayCam.getRot(2);
        const camDirect = gameplayCam.getDirection();
        mp.game.graphics.drawText(`Cam Pos: X: ${camPos.x.toFixed(4)}  Y: ${camPos.y.toFixed(4)}  z: ${camPos.z.toFixed(4)}`, [0.5, 0.03], {
            font: 0,
            color: [255, 255, 255, 255],
            scale: [0.4, 0.4],
            outline: true,
            centre: false
        });
        mp.game.graphics.drawText(`Cam Rot: X: ${camRot.x.toFixed(4)}  Y: ${camRot.y.toFixed(4)}  Z: ${camRot.z.toFixed(4)}`, [0.5, 0.055], {
            font: 0,
            color: [255, 255, 255, 255],
            scale: [0.4, 0.4],
            outline: true,
            centre: false
        });
        mp.game.graphics.drawText(`Cam Dir: X: ${camDirect.x.toFixed(4)}  Y: ${camDirect.y.toFixed(4)}  Z: ${camDirect.z.toFixed(4)}`, [0.5, 0.075], {
            font: 0,
            color: [255, 255, 255, 255],
            scale: [0.4, 0.4],
            outline: true,
            centre: false
        });
    });
});
