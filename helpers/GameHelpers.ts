import { GameTick, PlayArea } from '../types/Game';
import { Tile } from '../types/GameMap';

export class GameHelpers {
    private gameMessage: GameTick;
    private teamId: Id;
    ownPlayArea: PlayArea;
    enemyTeams: Id[];

    constructor(gameMessage: GameTick) {
        this.gameMessage = gameMessage;
        this.ownPlayArea = gameMessage.playAreas[gameMessage.teamId];
        this.teamId = gameMessage.teamId;
        this.enemyTeams = gameMessage.teams.filter((teamId: Id) => teamId !== this.teamId);
        this.getTileAt = this.getTileAt.bind(this)
        this.getIsTileEmpty = this.getIsTileEmpty.bind(this)
    }

    public getTileAt(y: number, x: number): Tile {
        return this.ownPlayArea.grid[y]?.[x] ?? null
    }

    public getIsTileEmpty(y: number, x: number): boolean {
        if (y > this.gameMessage.map.height || x > this.gameMessage.map.width) {
            return false
        }
        const tile = this.getTileAt(y, x)
        if (!tile) {
            return true
        }
        return !tile.paths && !tile.towers.length
    }
}