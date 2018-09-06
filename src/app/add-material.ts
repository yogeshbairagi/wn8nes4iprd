export class AddMaterial {
    constructor(
        public mattitle: string,
        public matdesc: string,
        public maturl: string,
        public tid: string,
        public mattype: string,
        public status: string,
        public addedby: string,
        public approvedby: string
    ) { }
}