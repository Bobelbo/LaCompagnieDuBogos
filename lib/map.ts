import { GameMap, Path } from "../types/GameMap";

export interface IValuedPositions {
    position: Position;
    value: number;
}

class ValuedPositions implements IValuedPositions {
    public position: Position;
    public value: number;
    constructor(pos: Position, val: number) {
        this.position = pos;
        this.value = val;
    }
}

export class MapUtils {
    private map: GameMap;

    constructor(map: GameMap) {
        this.map = map;
    }

    public getPositionArray(): IValuedPositions[] {
        let posArr: IValuedPositions[] = [];

        // Create array
        for (let x: number = 0; x < this.map.width; x++) {
            for (let y: number = 0; y < this.map.height; y++) {
                let pos = { x: x, y: y }
                if (!this.isObstacle(pos)) {
                    posArr.push(new ValuedPositions(pos, this.getValue(pos)))
                }
            }
        }

        // Filter bad decisions
        posArr.filter((pos) => pos.value > 0);
        posArr = posArr.sort((a, b) => a.value - b.value);

        return posArr;
    }

    private isObstacle(pos: Position) {
        return this.map.obstacles.some((obs: Position) => {
            obs.x === pos.x && obs.y === pos.y;
        }) || this.map.paths.some((path: Path) => {
            path.tiles.some((obs: Position) =>
                obs.x === pos.x && obs.y === pos.y
            );
        });
    }

    private getValue(pos: Position): number {
        let val = 0
        let r = 2

        this.map.paths.forEach((path: Path) => {
            path.tiles.forEach((obs: Position) => {
                if (Math.abs(obs.x - pos.x) <= r && Math.abs(obs.y - pos.y) <= r) val++;
            });
        });

        return val;
    }
}