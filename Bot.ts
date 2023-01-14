import { MapUtils } from './lib/map';
import { BuildCommand, Command, SellCommand } from './types/Command';
import { ReinforcementUtils } from './lib/reinforcement';
import { GameTick } from './types/Game';
import { TowerType } from './types/Tower';
import { TowerToBuy } from './types/Shop';

export class Bot {
    private state: GameTick;
    private mapUtils: MapUtils;
    private towers: Record<TowerType, TowerToBuy>;
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
        this.mapUtils = new MapUtils(this.state.map);
        this.towers = this.state.shop.towers;
    }

    coreLoop(): Command[] {
        const commands = [];

        this.money = this.state.teamInfos[this.state.teamId].money;

        this.getReinforcementCommand().forEach((x) => commands.push(x))
        this.getPayoutActions().forEach((x) => commands.push(x))
        this.round = this.state.round;

        console.log(commands)
        return commands;
    }

    getPayoutActions() {
        const cmd = [];
        console.log(this.state.ticksUntilPayout);
        if (this.state.ticksUntilPayout !== 59) return cmd;

        this.getTowerCommand().forEach((x) => cmd.push(x))

        return cmd;
    }

    getReinforcementCommand() {
        return new ReinforcementUtils(this.state).getReinforcementAction(this.money);
    }

    getTowerCommand() {
        const cmd = [];
        let moneySpending = 250;

        if (this.state.round <= 7) {
            moneySpending = 400;
        }
        else {
            moneySpending = 1500;
        }

        while (this.money > moneySpending){
        
            if (this.mapUtils.spearPositionArr.length > 0 && this.money >= this.towers.SPEAR_SHOOTER.price) {
                cmd.push(new BuildCommand(TowerType.SPEAR_SHOOTER, this.mapUtils.spearPositionArr.pop().position))
                this.money -= this.towers.SPEAR_SHOOTER.price;
            } else if (this.mapUtils.fuguPositionArr.length > 0 && this.money >= this.towers.SPIKE_SHOOTER.price) {
                cmd.push(new BuildCommand(TowerType.SPIKE_SHOOTER, this.mapUtils.fuguPositionArr.pop().position))
                this.money -= this.towers.SPIKE_SHOOTER.price;
            } else if (this.mapUtils.bombPositionArr.length > 0 && this.money >= this.towers.BOMB_SHOOTER.price) {
                const pos = this.mapUtils.bombPositionArr.pop().position;
                cmd.push(new SellCommand(pos));
                cmd.push(new BuildCommand(TowerType.BOMB_SHOOTER, pos));
                this.money -= this.towers.BOMB_SHOOTER.price;
            }
        }
        return cmd;
    }
}

