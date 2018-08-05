export class Addlinks {
    constructor(
        public linktitle: string,
        public linkdesc: string,
        public linkurl: string,
        public linkcategory: string,
        public catId: string,
        public linkid: number,
        public status: string,
        public addedby: string,
        public approvedby: string
    ) { }
}
