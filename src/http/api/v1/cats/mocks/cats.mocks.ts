import { MockTimestamps, MockUser } from "src/common/mocks/common.mocks";
import { CreateCatDto } from "../dto/cat.create.dto";
import { Cat } from "../entities/cats.entity";
import { UpdateCatDto } from "../dto/cat.update.dto";

export const CreateCatRequest: CreateCatDto = {
    name: "Portiphar",
    birthday: "2024-03-24T06:07:42.149Z",
    breed: "iberian"
}

export const CreateCatResponse = {
    ...CreateCatRequest,
    user_id: 4,
    user: MockUser,
    id: 2,
    ...MockTimestamps
} as unknown as Cat;

export const UpdateCatRequest: UpdateCatDto = {
    name: "Jolanda",
}

export const FetchManyCats = {
    items: [
        {
            cat_id: 2,
            cat_name: "Portiphar",
            cat_birthday: "2024-03-24T06:07:42.149Z",
            cat_breed: "iberian",
            favorite_num: "0"
        },
        {
            cat_id: 1,
            cat_name: "Dexter",
            cat_birthday: "2024-03-24T06:07:42.149Z",
            cat_breed: "persian",
            favorite_num: "0"
        }
    ] as unknown as Array<Cat>,
    count: 2
}

export const FetchManyCatsPaginationMeta = {
    first: "http://localhost:5001/api/v1/cats?page=1",
    last: "http://localhost:5001/api/v1/cats?page=NaN",
    prev: "http://localhost:5001/api/v1/cats?page=NaN",
    next: "http://localhost:5001/api/v1/cats?page=NaN",
    currentPage: null,
    previousPage: null,
    lastPage: null,
    total: 2
}