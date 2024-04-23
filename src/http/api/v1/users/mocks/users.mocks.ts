import { UserRole } from "src/common/types/user.types"
import { User } from "../entities/users.entity"

export const FetchManyUsersPaginationMeta = {
    first: "http://localhost:5001/api/v1/users?page=1",
    last: "http://localhost:5001/api/v1/users?page=NaN",
    prev: "http://localhost:5001/api/v1/users?page=NaN",
    next: "http://localhost:5001/api/v1/users?page=NaN",
    currentPage: null,
    previousPage: null,
    lastPage: null,
    total: 2
}

export const FetchManyUsers = {
    items: [
        {
            id: 4,
            created_at: "2024-04-22T17:39:06.572Z",
            update_at: "2024-04-22T17:50:17.752Z",
            first_name: "Oluwafikayo",
            last_name: "Sanni",
            email: "sanni.oluwafikayo@gmail.com",
            username: "oluwafikayomi",
            password: "f926b91963b91e3e46d68f694ac5f4d5",
            refresh_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjQsInJvbGVzIjpbInVzZXIiLCJhZG1pbiJdLCJpYXQiOjE3MTM4MDgyMTcsImV4cCI6MTcxNDQxMzAxN30.JH2OMFAOQPRirRCzoYx4vDwl5l-RojvmMokjHcj7vtk",
            roles: [
                UserRole.ADMIN,
                UserRole.USER
            ]
        },
        {
            id: 3,
            created_at: "2024-04-22T09:46:01.786Z",
            update_at: "2024-04-22T17:58:34.202Z",
            first_name: "Oluwafikayo",
            last_name: "Sanni",
            email: "fikayo.sanni@gmail.com",
            username: "oluwafikayomi",
            password: "f926b91963b91e3e46d68f694ac5f4d5",
            refresh_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjMsInJvbGVzIjpbInVzZXIiXSwiaWF0IjoxNzEzODA4MzU3LCJleHAiOjE3MTQ0MTMxNTd9.yfjOj5CupZIG42BmUJ94QF98HnZ5vpEqXxlPpdBBeQQ",
            roles: [
                UserRole.USER
            ]
        }
    ] as unknown as Array<User>,
    count: 2
}

export const UpdateUserRequest = {
    first_name: "Subomi"
}