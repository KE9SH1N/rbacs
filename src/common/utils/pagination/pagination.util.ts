import {
  FindManyOptions,
  ObjectLiteral,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationResult<T> {
  message?: string;
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function getPaginationParams(params: PaginationParams) {
  const page = params.page && params.page > 0 ? params.page : 1;
  const limit = params.limit && params.limit > 0 ? params.limit : 10;
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export async function paginate<T extends ObjectLiteral>(
  source: Repository<T> | SelectQueryBuilder<T>,
  page = 1,
  limit = 10,
  entityName = 'Data',
  options?: FindManyOptions<T>,
): Promise<PaginationResult<T>> {
  const skip = (page - 1) * limit;

  let data: T[];
  let total: number;

  if ('findAndCount' in source) {
    // Repository
    [data, total] = await source.findAndCount({
      skip,
      take: limit,
      ...options,
    });
  } else {
    // QueryBuilder
    [data, total] = await source.skip(skip).take(limit).getManyAndCount();
  }

  const totalPages = Math.ceil(total / limit);

  return {
    message:
      data.length === 0
        ? `No ${entityName} Data Found`
        : `${entityName} Data Retrieved Successfully`,
    data,
    total,
    page,
    limit,
    totalPages,
  };
}
