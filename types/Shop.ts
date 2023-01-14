import { EnemyType } from './Enemy';
import { TowerType } from './Tower';

export interface ReinforcementToBuy {
    price: Money;
    payoutBonus: Money;
    count: number;
    delayPerSpawnInTicks: number;
}

export interface TowerToBuy {
    price: Money;
}

export interface Shop {
    towers: Record<EnemyType, TowerToBuy>;
    reinforcements: Record<TowerType, ReinforcementToBuy>;
}
