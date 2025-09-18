export interface Car {
    _id: string;
    ownerTid: number;
    marka: string;
    order: string;
    model: string;
    age: string;
    vin: string;
    contact: string;
    info: string;
    deleted: boolean;
    dateForWork: Date;
    media: {type: 'photo' | 'video'; media: string}[] | string[];
    status: 'new' | 'open' | 'closeUnhappy' | 'closeHappy';
    dataHistoryLine: { tId: number; text: string; date: number }[];
    createdAt: Date;
    updatedAt: Date;

}
