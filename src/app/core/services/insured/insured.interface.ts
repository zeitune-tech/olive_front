
export class Insured {
    id: number;
    name: string;
    lastName: string;
    email: string;
    phone: string;
    birthDate

    constructor(insured: any) {
        this.id = insured?.id;
        this.name = insured?.name;
        this.lastName = insured?.lastName;
        this.email = insured?.email;
        this.phone = insured?.phone;
        this.birthDate = insured?.birthDate;
    }
}