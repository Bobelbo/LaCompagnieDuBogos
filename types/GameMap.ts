import { Enemy } from "./Enemy";
import { Tower } from "./Tower";

export interface Path {
    id: string;
    tiles: Position[];
}

export interface GameMap {
    name: string;
    width: number;
    height: number;
    paths: Path[];
    obstacles: Position[];
}

export interface Tile {
    towers: Tower[];
    enemies: Enemy[];
    paths: string[];
    hasObstacle: boolean;
}

export type Grid = Map<number, Map<number, Tile>>