import { Reinforcement } from './Enemy';

export interface Team {
    id: Id;
    money: Money;
    hp: Hp
    isAlive: LifeCondition;
    name: string;
    payoutBonus: Money;
    sentReinforcements: Reinforcement[]
}