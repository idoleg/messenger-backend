import Room from "./Room";

export default class RoomRepository {

    protected rooms: {[index: string ]: Room} = {};

    public create(name: string) {
        const room = new Room(name);
        this.add(room);

        return room;
    }

    public add(room: Room) {
        this.rooms[room.getName()] = room;

        return room;
    }

    public has(name: string) {
        return !!this.rooms[name];
    }

    public get(name: string) {
        return this.rooms[name];
    }

    public getOrCreate(name: string) {
        if (this.has(name)) return this.get(name);
        return this.create(name);
    }

    public remove(name: string) {
        delete this.rooms[name];
    }

    public clear() {
        this.rooms = {};
    }
}
