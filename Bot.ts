import { IValuedPositions, MapUtils } from './lib/map';
import { BuildCommand, Command } from './types/Command';
import { ReinforcementUtils } from './lib/reinforcement';
import { GameTick } from './types/Game';
import { TowerType } from './types/Tower';

export class Bot {
    private state: GameTick;
    private positionArr: IValuedPositions[];
    private round: number;
    private money: number;

    constructor() {
        console.log('Initializing your super duper mega bot');
    }

    // Main
    getActions(gameMessage: GameTick): Command[] {
        this.state = gameMessage;
        if (gameMessage.round === 0) {
            this.gameSetup();
            this.round = -1;
        }

        return this.coreLoop();
    }

    gameSetup() {
        this.positionArr = new MapUtils(this.state.map).getPositionArray();
    }

    coreLoop(): Command[] {
        let commands = [];
        this.money = this.state.teamInfos[this.state.teamId].money;

        this.getRoundActions().forEach((x) => commands.push(x))
        this.getReinforcementCommand().forEach((x) => commands.push(x))

        this.round = this.state.round;

        console.log(commands)
        return commands;
    }

    getRoundActions() {
        if (this.round >= this.state.round) return [];

        return this.getTowerCommand();
    }

    getReinforcementCommand() {
        let cmd = new ReinforcementUtils(this.state).getReinforcementAction(this.money);
        return cmd;
    }

    getTowerCommand() {
        let cmd = [new BuildCommand(TowerType.SPEAR_SHOOTER, this.positionArr.pop().position)];
        this.money -= 200;
        return cmd;
    }
}

