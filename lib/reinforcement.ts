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
        const enemies: ReinforcementRoi[] = this.getBestReinforcement()
        this.actions = [];

        enemies.forEach((e: ReinforcementRoi) => {
            let reinforcements: number = this.state.teamInfos[this.state.teamId].sentReinforcements.length
            while (money-e.price >= 0 && reinforcements < 8) {
                money -= e.price;
                reinforcements++;
                this.actions.push(new SendReinforcementCommand(e.type, this.getMinHpEnemyTeamId()));
            }
        })

        return this.actions;
    }

    private getBestReinforcement(): ReinforcementRoi[] {
        const roiArr: ReinforcementRoi[] = [];

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
    private getMinHpEnemyTeamId(): string {
        let minHp:string=null;
        Object.keys(this.state.teamInfos).forEach(
            (id:string) => {
                const teamInfo=this.state.teamInfos[id];
                if (minHp==null) {
                    minHp = id;
                } else if(teamInfo.isAlive && teamInfo.hp<this.state.teamInfos[minHp].hp) {
                    minHp=teamInfo.id;
                } 
            }
        )

        return minHp;
    }
}

// let enemies: EnemyType[] = this.getBestReinforcement()
//         const gameHelper = new GameHelpers(this.state);
//         const { enemyTeams } = gameHelper;
//         this.actions = [];

//         if (this.state.teamInfos[this.state.teamId].money > enemies[0].)
            

//         return this.actions;
// let minHp:string
//         let theTeamId:Id
//          for(let i=0;i<3;i++){
//             theTeamId= new GameHelpers(this.state).enemyTeams[i]
//             if(i==0){minHp=theTeamId}
//             if(this.state.teamInfos[theTeamId].isAlive){
//                   if(this.state.teamInfos[theTeamId].hp<this.state.teamInfos[minHp].hp){
//                     minHp=theTeamId
//                   } 
//             }
//         }
//         return minHp;