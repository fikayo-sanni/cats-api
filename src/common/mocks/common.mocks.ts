export const MockTimestamps = {
    created_at: new Date('2024-04-22T09:46:01.786Z'),
    update_at: new Date('2024-04-22T09:46:01.786Z'),
}

export const MockUser = {
    id: 4,
    ...MockTimestamps,
    first_name: "Jackson",
    last_name: "Sparrow",
    email: "sanni.oluwafikayo@gmail.com",
    username: "oluwafikayomi",
    roles: [
        "user",
        "admin"
    ]
}

export const MockPaginationParams = {
    take: 15,
    skip: 0,
}