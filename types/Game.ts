import { Enemy, Reinforcement } from './Enemy';
import { GameMap, Grid } from './GameMap';
import { Shop } from './Shop';
import { Team } from './Team';
import { Tower } from './Tower';

export interface PlayArea {
    teamId: string;
    enemies: Enemy[];
    enemyReinforcementQueue: Reinforcement[];
    towers: Tower[];
    grid: Grid;
}

export interface GameTick {
    teamId: string;
    tick: number;
    map: GameMap;
    teams: string[];
    teamInfos: Record<string, Team>;
    playAreas: Record<string, PlayArea>;
    round: number;
    ticksUntilPayout: number;
    lastTickErrors: string[];
    shop: Shop;
    constants: Constants;
}

export interface Constants {
    payoutIntervalInTick: number;
    maxReinforcementsSentPerTeam: number;
}

export class GameMessage implements GameTick {
    public readonly teamId: Id;
    public readonly tick: number;
    public readonly map: GameMap;
    public readonly teams: Id[];
    public readonly teamInfos: Record<string, Team>;
    public readonly playAreas: Record<string, PlayArea>;
    public readonly round: number;
    public readonly ticksUntilPayout: number;
    public readonly lastTickErrors: string[];
    public readonly shop: Shop;
    public readonly constants: Constants;

    constructor(rawTick: GameTick) {
        Object.assign(this, rawTick);
    }
}
