import { UserRole } from "src/common/types/user.types";
import { Favorite } from "../entities/favorites.entity";

export const CreateFavoriteResult = {
    cat_id: 2,
    user_id: 3,
    cat: {
        id: 2,
        created_at: "2024-04-22T22:10:08.773Z",
        update_at: "2024-04-22T22:26:50.653Z",
        name: "Delilah",
        birthday: "2024-03-24T06:07:42.149Z",
        breed: "iberian",
        user_id: 4,
        user: {
            id: 4,
            created_at: "2024-04-22T17:39:06.572Z",
            update_at: "2024-04-22T21:17:28.582Z",
            first_name: "Jackson",
            last_name: "Sparrow",
            email: "sanni.oluwafikayo@gmail.com",
            username: "oluwafikayomi",
            roles: [
                UserRole.USER,
                UserRole.ADMIN
            ]
        }
    },
    user: {
        id: 3,
        created_at: "2024-04-22T09:46:01.786Z",
        update_at: "2024-04-22T21:37:51.390Z",
        first_name: "Jackson",
        last_name: "Sparrow",
        email: "fikayo.sanni@gmail.com",
        username: "oluwafikayomi",
        roles: [
            UserRole.USER
        ]
    },
    id: 1,
    created_at: "2024-04-22T22:47:36.180Z",
    update_at: "2024-04-22T22:47:36.180Z"
} as unknown as Favorite


export const FetchManyLikes = {
    items: [
        {
            id: 2,
            created_at: "2024-04-22T22:59:45.716Z",
            update_at: "2024-04-22T22:59:45.716Z",
            cat_id: 2,
            user_id: 3,
            cat: {
                id: 2,
                created_at: "2024-04-22T22:10:08.773Z",
                update_at: "2024-04-22T22:26:50.653Z",
                name: "Delilah",
                birthday: "2024-03-24T06:07:42.149Z",
                breed: "iberian",
                user_id: 4
            },
            user: {
                id: 3,
                created_at: "2024-04-22T09:46:01.786Z",
                update_at: "2024-04-22T21:37:51.390Z",
                first_name: "Jackson",
                last_name: "Sparrow",
                email: "fikayo.sanni@gmail.com",
                username: "oluwafikayomi",
                roles: [
                    UserRole.USER,
                ]
            }
        }
    ] as unknown as Array<Favorite>,
    count: 1
}

export const FetchManyLikesPaginationMeta = {
    first: "http://localhost:5001/api/v1/favorites/cat/1?page=1",
    last: "http://localhost:5001/api/v1/favorites/cat/1?page=NaN",
    prev: "http://localhost:5001/api/v1/favorites/cat/1?page=NaN",
    next: "http://localhost:5001/api/v1/favorites/cat/1?page=NaN",
    currentPage: null,
    previousPage: null,
    lastPage: null,
    total: 1
}