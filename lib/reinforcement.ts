import { GameHelpers } from "../helpers/GameHelpers";
import { GameTick } from "../types/Game";
import { SendReinforcementCommand, CommandAction } from "../types/Command";
import { EnemyType } from "../types/Enemy";

class ReinforcementRoi {
    public type: EnemyType
    public roi: number
    public price: number;

    constructor(type: EnemyType, roi: number, price: number) {
        this.type = type;
        this.roi = roi;
        this.price = price;
    }
}

export class ReinforcementUtils {

    private state: GameTick;
    private actions: CommandAction[];

    constructor(state: GameTick) {
        this.state = state;
    }

    getReinforcementAction(money: number): CommandAction[] {
        let enemies: ReinforcementRoi[] = this.getBestReinforcement()
        const gameHelper = new GameHelpers(this.state);
        const { enemyTeams } = gameHelper;
        this.actions = [];

        enemies.reverse().forEach((e: ReinforcementRoi) => {
            while (money-e.price >= 0) {
                this.actions.push(new SendReinforcementCommand(e.type, this.state.teamInfos[0].id));
            }
        })

        return this.actions;
    }

    private getBestReinforcement(): ReinforcementRoi[] {
        let roiArr: ReinforcementRoi[] = [];

        Object.keys(this.state.shop.reinforcements).forEach(
            (type: string) => {
                roiArr.push(new ReinforcementRoi(
                    type as EnemyType,
                    this.state.shop.reinforcements[type].payoutBonus /
                    this.state.shop.reinforcements[type].price,
                    this.state.shop.reinforcements[type].price,
                    ))
            }
        )

        return roiArr.sort((a, b) => a.roi - b.roi);
    }
}

// let enemies: EnemyType[] = this.getBestReinforcement()
//         const gameHelper = new GameHelpers(this.state);
//         const { enemyTeams } = gameHelper;
//         this.actions = [];

//         if (this.state.teamInfos[this.state.teamId].money > enemies[0].)
            

//         return this.actions;