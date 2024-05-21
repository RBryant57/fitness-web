export class Route {
    constructor(
        public id: number,
        public name: string,
        public city: string,
        public state: string,
        public typeId: number,
        public rating: number,
        public notes: string
    ){}
}