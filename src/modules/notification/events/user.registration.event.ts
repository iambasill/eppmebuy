export class UserRegistrationEvent {
    constructor(
        public readonly email: string,
        public readonly name: string,
    ) { }
}
