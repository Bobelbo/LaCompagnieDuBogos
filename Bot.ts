import { IValuedPositions, MapUtils } from './lib/map';
import { BuildCommand, Command } from './types/Command';
import { ReinforcementUtils } from './lib/reinforcement';
import { GameTick } from './types/Game';
import { TowerType } from './types/Tower';

export class Bot {
    private state: GameTick;
    private positionArr: IValuedPositions[];
    private lastRecordedRound: Number;

    constructor() {
        console.log('Initializing your super duper mega bot');
    }

    // Main
    getActions(gameMessage: GameTick): Command[] {
        this.state = gameMessage;
        if (gameMessage.round === 0) { this.gameSetup() }

        return this.coreLoop();
    }

    gameSetup() {
        this.positionArr = new MapUtils(this.state.map).getPositionArray();
        console.log(this.positionArr)
    }

    coreLoop(): Command[] {
        let commands = [];

        commands.push(this.getTowerCommand());
        new ReinforcementUtils(this.state).getReinforcementAction().forEach((x) => commands.push(x))

        console.log(commands)
        return commands;
    }

    getTowerCommand() {
        return new BuildCommand(TowerType.SPEAR_SHOOTER, this.positionArr.pop().position)
    }
}

