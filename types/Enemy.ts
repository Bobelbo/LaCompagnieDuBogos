export enum EnemyType {
    LVL1 = 'LVL1',
    LVL2 = 'LVL2',
    LVL3 = 'LVL3',
    LVL4 = 'LVL4',
    LVL5 = 'LVL5',
    LVL6 = 'LVL6',
    LVL7 = 'LVL7',
    LVL8 = 'LVL8',
    LVL9 = 'LVL9',
    LVL10 = 'LVL10',
    LVL11 = 'LVL11',
    LVL12 = 'LVL12',
}

export interface Enemy {
    id: Id;
    type: EnemyType;
    position: Position;
    precisePosition: Position;
    isKilled: LifeCondition;
    hasEndedPath: boolean;
}

export interface Reinforcement {
    enemyType: EnemyType;
    count: number;
    from: Id;
    to: Id;
}
