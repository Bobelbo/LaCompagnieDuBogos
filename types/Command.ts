import { EnemyType } from './Enemy';
import { TowerType } from "./Tower";

enum ActionTypes {
  BUILD = "BUILD",
  SELL = "SELL",
  SEND_REINFORCEMENTS = "SEND_REINFORCEMENTS",
}

interface ActionBase {
  action: ActionTypes
}

interface BuildAction extends ActionBase {
  action: ActionTypes.BUILD;
  towerType: TowerType;
  position: Position
}

interface SellAction extends ActionBase {
  action: ActionTypes.SELL;
  position: Position
}

interface SendReinforcementAction extends ActionBase {
  action: ActionTypes.SEND_REINFORCEMENTS;
  enemyType: EnemyType
  team: Id
}

export type CommandAction = BuildAction | SellAction | SendReinforcementAction

export interface Command {
  actions: CommandAction[]
}

export class BuildCommand implements BuildAction{
  action: ActionTypes.BUILD = ActionTypes.BUILD;
  position: Position;
  towerType: TowerType;
  
  constructor(towerType: TowerType, position: Position) {
    this.towerType = towerType;
    this.position = position;
  }
}

export class SellCommand implements SellAction {
  action: ActionTypes.SELL = ActionTypes.SELL;
  position: Position

  constructor(position: Position) {
    this.position = position;
  }
}

export class SendReinforcementCommand implements SendReinforcementAction {
  action: ActionTypes.SEND_REINFORCEMENTS = ActionTypes.SEND_REINFORCEMENTS;
  enemyType: EnemyType;
  team: string;
  
  constructor(bubbleType: EnemyType, team: string) {
    this.enemyType = bubbleType;
    this.team = team;
  }
}
