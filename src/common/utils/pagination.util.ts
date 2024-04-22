import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import {
  IPaginationMeta,
  IMetaResponse,
  IPaginationOptions,
} from '../interfaces/pagination.interface';
import { Request } from 'express';

export const PaginationOptions = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): IPaginationOptions => {
    const request = ctx.switchToHttp().getRequest();
    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage) || 15;

    const take = perPage;
    const skip = (page - 1) * perPage;

    return { take, skip };
  },
);

export function getPaginationMeta(
  total: number,
  currentPage: number,
  perPage: number,
): IPaginationMeta {
  const totalPages = Math.ceil(total / perPage);

  return {
    currentPage,
    perPage,
    total,
    totalPages,
  };
}

export function generateMetaResponse(
  count: number,
  { take: perPage, skip }: IPaginationOptions,
  req: Request,
): IMetaResponse {
  const currentPage = Math.floor(skip / perPage) + 1;
  const totalPages = Math.ceil(count / perPage);

  const fullUrl = `${process.env.APP_URL}${req.originalUrl}`;

  return {
    first: currentPage === 1 ? null : modifyUrlPageParam(fullUrl, 1),
    last: modifyUrlPageParam(fullUrl, totalPages),
    prev:
      currentPage <= 1 ? null : modifyUrlPageParam(fullUrl, currentPage - 1),
    next:
      currentPage >= totalPages
        ? null
        : modifyUrlPageParam(fullUrl, currentPage + 1),
    currentPage,
    previousPage: currentPage <= 1 ? null : currentPage - 1,
    lastPage: totalPages,
    perPage,
    total: count, // Total count of items
  };
}

function modifyUrlPageParam(url: string, newPage: number): string {
  const parsedUrl = new URL(url);
  parsedUrl.searchParams.delete('page');
  parsedUrl.searchParams.set('page', `${newPage}`);
  return parsedUrl.toString();
}
