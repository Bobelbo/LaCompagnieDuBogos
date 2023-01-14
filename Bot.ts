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
    private nbSpear:number;
    private nbFugu:number;
    private money: number;

    constructor() {
        console.log('Initializing your super duper mega bot');
        this.nbFugu = 0;
        this.nbSpear = 0;
    }

    // Main
    getActions(gameMessage: GameTick): Command[] {
        this.state = gameMessage;
        if (gameMessage.round === 0) {
            this.gameSetup();
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
        this.getPayoutActions().forEach((x) => commands.push(x))

        console.log(commands)
        return commands;
    }

    getPayoutActions() {
        const cmd = [];
        console.log(this.state.ticksUntilPayout);
        if (this.state.ticksUntilPayout !== 60) return this.getReinforcementCommand();

        this.getTowerCommand().forEach((x) => cmd.push(x))

        return cmd;
    }

    getReinforcementCommand() {
        return new ReinforcementUtils(this.state).getReinforcementAction(this.money);
    }

    getTowerCommand() {
        const cmd = [];
        let maxTurretPlacement = 2;

        if (this.state.round >= 4) {
            maxTurretPlacement = 3;
        }else if (this.state.round >= 12) {
            maxTurretPlacement = 10;
        } else {
            maxTurretPlacement = 15;
        }

        for (let i = 0; i < maxTurretPlacement; i++){
            if (this.mapUtils.spearPositionArr.length > 0 && this.money >= this.towers.SPEAR_SHOOTER.price) {
                if (this.nbSpear + 1 > this.nbFugu + 1 * 2 && this.mapUtils.fuguPositionArr.length > 0 && this.money >= this.towers.SPIKE_SHOOTER.price) {
                    cmd.push(this.addFugu())
                }
                cmd.push(this.addSpear())
            } else if (this.mapUtils.fuguPositionArr.length > 0 && this.money >= this.towers.SPIKE_SHOOTER.price) {
                cmd.push(this.addFugu())
            } else if (this.mapUtils.bombPositionArr.length > 0 && this.money >= this.towers.BOMB_SHOOTER.price) {
                this.sellAddBomb().forEach((x) => cmd.push(x))
            }
        }
        return cmd;
    }

    addSpear() {
        this.nbSpear++;
        this.money -= this.towers.SPEAR_SHOOTER.price;
        return new BuildCommand(TowerType.SPEAR_SHOOTER, this.mapUtils.spearPositionArr.pop().position)
    }

    addFugu() {
        this.nbFugu++;
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

