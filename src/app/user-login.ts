export class UserLogin {
    constructor(
        public userId: string,
        public password: string,
        public pwdshow: boolean,
        public msgshow: boolean,
        public goshow: boolean,
        public loginmsg: boolean
    ) { }
}
