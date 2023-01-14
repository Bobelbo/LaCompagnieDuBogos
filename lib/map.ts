import { GameMap, Path } from "../types/GameMap";

export interface IValuedPositions {
    position: Position;
    value: number;
    id: string[]
}

class ValuedPositions implements IValuedPositions {
    public position: Position;
    public value: number;
    public id: string[];

    constructor(pos: Position, val: number, id?: string[]) {
        this.position = pos;
        this.value = val;
        this.id = id;
    }
}

export class MapUtils {
    private map: GameMap;
    public spearPositionArr: IValuedPositions[];
    public bombPositionArr: IValuedPositions[];
    public fuguPositionArr: IValuedPositions[];

    constructor(map: GameMap) {
        this.map = map;
        const x = this.setupArrays()
        const y = this.fuguPositionArr;

        this.spearPositionArr = x.splice(x.length-10);
        this.fuguPositionArr = y.splice(y.length-10);
        this.bombPositionArr = [...this.fuguPositionArr].concat([...y]).concat([...this.spearPositionArr]).concat([...x]);
    }

    private setupArrays(): ValuedPositions[] {
        const placeholder = []
        this.fuguPositionArr = []

        // Create array
        for (let x = 0; x < this.map.width; x++) {
            for (let y = 0; y < this.map.height; y++) {
                const pos = { x: x, y: y };
                if (!this.isObstacle(pos)) {
                    const fuguValue = this.getValue(pos, 1);
                    if (fuguValue.val > 3) {
                        this.fuguPositionArr.push(new ValuedPositions(pos, fuguValue.val, fuguValue.ids));
                    } else {
                        const spearValue = this.getValue(pos, 2);
                        if (spearValue.val > 2) {
                            placeholder.push(new ValuedPositions(pos, spearValue.val, spearValue.ids));
                        }
                    }
                }
            }
        }

        // Filter bad decisions
        this.fuguPositionArr = this.fuguPositionArr.sort((a, b) => a.id.length - b.id.length || a.value - b.value);
        return placeholder.sort((a, b) => a.id.length - b.id.length || a.value - b.value);
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

    private getValue(pos: Position, r: number): {val:number, ids:string[]} {
        let val = 0
        const ids = []

        this.map.paths.forEach((path: Path) => {
            path.tiles.forEach((obs: Position) => {
                if (Math.abs(obs.x - pos.x) <= r && Math.abs(obs.y - pos.y) <= r) {
                    val++;
                    if (!ids.includes(path.id)) {
                        ids.push(path.id)
                    }
                }
            });
        });

        return {val:val, ids:ids};
    }
}