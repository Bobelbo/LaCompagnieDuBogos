import { GameHelpers } from './helpers/GameHelpers';
import { Command, SendReinforcementCommand } from './types/Command';
import { EnemyType } from './types/Enemy';
import { GameTick } from './types/Game';

export class Bot {
    constructor() {
        console.log('Initializing your super duper mega bot');
        // This method should be use to initialize some variables you will need throughout the game.
    }
    /*
     * Here is where the magic happens, for now the moves are random. I bet you can do better ;)
     */
    getActions(gameMessage: GameTick): Command[] {
        const { enemyTeams } = new GameHelpers(gameMessage);

        let commands = [];
        commands = [new SendReinforcementCommand(EnemyType.LVL1, enemyTeams[0])];

        return commands;
    }
}
