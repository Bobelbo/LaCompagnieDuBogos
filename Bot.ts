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
    private money: number;

    constructor() {
        console.log('Initializing your super duper mega bot');
    }

    // Main
    getActions(gameMessage: GameTick): Command[] {
        this.state = gameMessage;

        return this.coreLoop();
    }

    gameSetup() {
        this.mapUtils = new MapUtils(this.state.map);
        this.towers = this.state.shop.towers;
    }

    coreLoop(): Command[] {
        const commands = [];

        this.money = this.state.teamInfos[this.state.teamId].money;
        this.getPayoutActions().forEach((x) => commands.push(x))

        console.log(commands)
        return commands;
    }

    getPayoutActions() {
        const cmd = [];
        if (this.state.round === 0) {
            this.gameSetup();
            return this.getReinforcementCommand();
        }

        console.log(this.state.ticksUntilPayout);
        if (this.state.ticksUntilPayout !== 59) return this.getReinforcementCommand();

        this.getTowerCommand().forEach((x) => cmd.push(x))

        return cmd;
    }

    getReinforcementCommand() {
        return new ReinforcementUtils(this.state).getReinforcementAction(this.money);
    }

    getTowerCommand() {
        const cmd = [];

        // eslint-disable-next-line no-constant-condition
        while (true){
            if (this.mapUtils.spearPositionArr.length > 0 && this.money >= this.towers.SPEAR_SHOOTER.price) {
                cmd.push(this.addSpear())
            } else if (this.mapUtils.fuguPositionArr.length > 0 && this.money >= this.towers.SPIKE_SHOOTER.price) {
                cmd.push(this.addFugu())
            } else if (this.mapUtils.bombPositionArr.length > 0 && this.money >= this.towers.BOMB_SHOOTER.price) {
                this.sellAddBomb().forEach((x) => cmd.push(x))
            } else {
                return cmd;
            }
        }
    }

    addSpear() {
        this.money -= this.towers.SPEAR_SHOOTER.price;
        return new BuildCommand(TowerType.SPEAR_SHOOTER, this.mapUtils.spearPositionArr.pop().position)
    }

    addFugu() {
        this.money -= this.towers.SPIKE_SHOOTER.price;
        return new BuildCommand(TowerType.SPIKE_SHOOTER, this.mapUtils.fuguPositionArr.pop().position)
    }

    sellAddBomb() {
        const cmd = [];
        const pos = this.mapUtils.bombPositionArr.pop().position;
        this.money -= this.towers.BOMB_SHOOTER.price;
        cmd.push(new SellCommand(pos));
        cmd.push(new BuildCommand(TowerType.BOMB_SHOOTER, pos));
        return cmd;
    }
}

