import Room from "../Room/Room";
import RoomRepository from "../Room/RoomRepository";
import User from "./User";

export default class UserRepository {

    protected users: {[index: string ]: Room} = {};
    protected roomRepository: RoomRepository;

    constructor(roomRepository: RoomRepository) {
        this.roomRepository = roomRepository;
    }

    public create(id: string) {
        const name = "user:" + id;
        const user = new User(name);
        this.add(user);

        return user;
    }

    public add(user: User) {
        this.users[user.getName()] = user;
        this.roomRepository.add(user);

        return user;
    }

    public has(id: string) {
        const name = "user:" + id;
        return !!this.users[name];
    }

    public getOrCreate(id: string) {
        if (this.has(id)) return this.get(id);
        return this.create(id);
    }

    public get(id: string) {
        const name = "user:" + id;
        return this.users[name];
    }

    public remove(id: string) {
        const name = "user:" + id;
        delete this.users[name];
    }

    public clear() {
        this.users = {};
    }
}
