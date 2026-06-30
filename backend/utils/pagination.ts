export function getPagination(query: any) {
    const DEFAULT_PAGE = 1;
  
    let page = Number(query.page) || DEFAULT_PAGE;
    let limit = query.limit !== undefined ? Number(query.limit) : undefined;
  
    if (page < 1) page = DEFAULT_PAGE;
    if (limit !== undefined && limit < 1) limit = undefined;
  
    return { page, limit };
  }
  