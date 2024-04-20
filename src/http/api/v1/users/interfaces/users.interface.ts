export interface IUser {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    username: string;
    password: string;
    refresh_token?: string;
    access_token?: string;
    created_at?: Date;
    updated_at?: Date;
}
