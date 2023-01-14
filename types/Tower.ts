import { EnemyType } from './Enemy';

export enum TowerType {
  SPIKE_SHOOTER = "SPIKE_SHOOTER",
  SPEAR_SHOOTER = "SPEAR_SHOOTER",
  BOMB_SHOOTER = "BOMB_SHOOTER",
}

export interface Tower {
  attackedEnemies: EnemyType[]
  id: string;
  type: TowerType;
  position: Position;
  width: number;
  height: number;
  isShooting: boolean;
}
