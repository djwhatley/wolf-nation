export class Volunteer {
    name: string;
    phone: string;
    email: string;

    districts: {
        lower: number,
        upper: number
    };

    outreach: {
        attempts: number,
        lastAttempt: Date,
        lastReponse: Date
    };
    
    notes: string;

    isOrganizer: boolean;
    isDormant: boolean;
}