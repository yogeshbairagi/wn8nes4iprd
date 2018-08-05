export class AddDashboard {
    constructor(
        public category: string,
        public dname: string,
        public ddesc: string,
        public dlink: string,
        public uusers: number,
        public views: number,
        public age: number,
        public image: string,
        public imageuri: string,
        public addedby: string,
        public approvedby: string
    ) { }
}
