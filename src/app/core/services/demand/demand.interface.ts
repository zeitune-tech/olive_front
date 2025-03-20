
export class Demand {
    id: number;
    name: string;
    lastName: string;
    email: string;
    phone: string;
    birthDate

    constructor(demand: any) {
        this.id = demand?.id;
        this.name = demand?.name;
        this.lastName = demand?.lastName;
        this.email = demand?.email;
        this.phone = demand?.phone;
        this.birthDate = demand?.birthDate;
    }
}