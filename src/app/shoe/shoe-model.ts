export class Shoe {
    constructor(
        public id: number,
        public name: string,
        public manufacturerId: number,
        public shoeTypeId: number,
        public acquisitionDate: Date,
        public retireDate: Date,
        public notes: string
    ){}
}