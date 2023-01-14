import { GameHelpers } from "../helpers/GameHelpers";
import { GameTick } from "../types/Game";
import { SendReinforcementCommand, CommandAction } from "../types/Command";
import { EnemyType } from "../types/Enemy";

class ReinforcementRoi {
    public type: EnemyType
    public roi: number

    constructor(type: EnemyType, roi: number) {
        this.type = type;
        this.roi = roi;
    }
}

export class ReinforcementUtils {

    private state: GameTick;
    private actions: CommandAction[];

    constructor(state: GameTick) {
        this.state = state;
    }

    getReinforcementAction(): CommandAction[] {
        const gameHelper = new GameHelpers(this.state);
        const { enemyTeams } = gameHelper;
        this.actions = [];

        if (this.state.teamInfos[this.state.teamId].money > 15)
            this.actions.push(new SendReinforcementCommand(EnemyType.LVL2, enemyTeams[0]));

        return this.actions;
    }
    /*
        private getBestReinforcement(): EnemyType[] {
            let roiArr: ReinforcementRoi[] = [];
    
            Object.keys(this.state.shop.reinforcements).forEach(
                (type: string) => {
                    roiArr.push(new ReinforcementRoi(
                        type as EnemyType,
                        this.state.shop.reinforcements[type].payoutBonus /
                        this.state.shop.reinforcements[type].price))
                }
            )
    
            return roiArr.sort((a, b) => a.roi - b.roi).map((x) => x.type);
        }*/
}