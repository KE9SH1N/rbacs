export type OrderDirection = 'ASC' | 'DESC';

const allowedOrderFields = ['createdAt', 'serial'] as const;
export type OrderField = (typeof allowedOrderFields)[number];

interface OrderParams {
  orderBy?: string;
  direction?: String;
}

/**
 * Parses and validates order params.
 * Defaults: orderBy = 'createdAt', direction = 'DESC'
 */

export function parseOrderParams(params: OrderParams): {
  orderBy: OrderField;
  direction: OrderDirection;
} {
  let { orderBy, direction } = params;
  if (!allowedOrderFields.includes(orderBy as OrderField)) {
    orderBy = 'createdAt';
  }

  direction = direction?.toUpperCase();
  if (direction !== 'ASC' && direction !== 'DESC') {
    direction = 'DESC';
  }

  return {
    orderBy: orderBy as OrderField,
    direction: direction as OrderDirection,
  };
}
