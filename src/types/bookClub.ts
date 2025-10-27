export interface IBookClub {
    id: string;
    clubName: string;
    password: string;
    createdAt: string;
    members: {
        user: string;
        nickname: string;
    }[];
}
