export class AddUser {
    constructor(
        public userId: string,
        public fname: string,
        public lname: string,
        public role: string,
        public status: string,
        public password: string
    ) { }
}
