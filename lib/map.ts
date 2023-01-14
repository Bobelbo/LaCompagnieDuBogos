import { GameMap, Path } from "../types/GameMap";

export interface IValuedPositions {
    position: Position;
    value: number;
}

class ValuedPositions implements IValuedPositions {
    public position: Position;
    public value: number;
    public data: any;

    constructor(pos: Position, val: number, data?: any) {
        this.position = pos;
        this.value = val;
        this.data = data;
    }
}

export class MapUtils {
    private map: GameMap;
    public spearPositionArr: IValuedPositions[];
    public bombPositionArr: IValuedPositions[];
    public fuguPositionArr: IValuedPositions[];

    constructor(map: GameMap) {
        this.map = map;
        this.setupArrays()
        this.bombPositionArr = [...this.spearPositionArr]
    }

    private setupArrays(): void {
        this.spearPositionArr = []
        this.fuguPositionArr = []

        // Create array
        for (let x = 0; x < this.map.width; x++) {
            for (let y = 0; y < this.map.height; y++) {
                const pos = { x: x, y: y };
                if (!this.isObstacle(pos)) {
                    const fuguValue = this.getValue(pos, 1);
                    if (fuguValue > 3) {
                        this.fuguPositionArr.push(new ValuedPositions(pos, fuguValue, this.isObstacle(pos)));
                    } else {
                        const spearValue = this.getValue(pos, 2);
                        if (spearValue > 2) {
                            this.spearPositionArr.push(new ValuedPositions(pos, spearValue, this.isObstacle(pos)));
                        }
                    }
                }
            }
        }

        // Filter bad decisions
        this.spearPositionArr = this.spearPositionArr.sort((a, b) => a.value - b.value);
        this.fuguPositionArr = this.fuguPositionArr.sort((a, b) => a.value - b.value);
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

    private getValue(pos: Position, r: number): number {
        let val = 0

        this.map.paths.forEach((path: Path) => {
            path.tiles.forEach((obs: Position) => {
                if (Math.abs(obs.x - pos.x) <= r && Math.abs(obs.y - pos.y) <= r) val++;
            });
        });

        return val;
    }
}