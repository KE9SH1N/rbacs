// utils/response.util.ts
export function successResponse(message: string, status: string, data?: any) {
  if (data !== undefined) {
    return {
      message,
      status,
      data,
    };
  }
  return {
    message,
    status,
  };
}
