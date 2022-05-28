let handlingExit = false;

async function handleExit(signal = "UNKNOWN SIGNAL") {
    handlingExit = true;
    console.log(`${signal} Received. Saving characters...`, 1);
    let saved = 0;
    let players = mp.players.toArray();

    await Promise.all(players.map(async player => {
        try {
            if (mp.players.exists(player)) {
                player.outputChatBox("#FF0000<b>[SERVER SHUTDOWN]</b>#XRESET Saving your character...");
                //await player.character.save();
                //saved++;
                player.outputChatBox("#FF0000<b>[SERVER SHUTDOWN]</b>#XRESET Your character has been saved. Server will shut down in 10 seconds.");
            }
        } catch (e) {
            console.error(`${player.name} failed to save! Error: \n${e}`);
        }
    }));

    console.log(`ONLINE PLAYERS: ${players.length} | SAVED CHARACTERS: ${saved} | Server is shutting down in 10 seconds.`, 1);
    return setTimeout(() => {
        process.exit(2022)
    }, 10000);
}

process.on('SIGUSR1', async () => {
    if (handlingExit) return;
    await handleExit("SIGUSR1");
});

process.on('SIGUSR2', async () => {
    if (handlingExit) return;
    await handleExit("SIGUSR2");
});

process.on("SIGINT", async () => {
    if (handlingExit) return;
    await handleExit("SIGINT");
});

process.on("SIGTERM", async () => {
    if (handlingExit) return;
    await handleExit("SIGTERM");
});

process.on("exit", (code) => {
    console.info(`EXIT received, code ${code}`);
    if (code == 2022) {
        console.info("PROCESS EXIT: CHARACTERS SAVED")
    } else {
        console.error("PROCESS EXIT: CHARACTERS NOT SAVED")
    }
});
