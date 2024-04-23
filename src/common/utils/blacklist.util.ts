const blacklist = ['refresh_token', 'password'];
export const request_blacklist = [...blacklist, , 'roles'];
export const response_blacklist = [...blacklist]

export const stripAttributes = (obj: unknown, blacklist: string[]): unknown => {
    if (Array.isArray(obj)) {
      return obj.map((item) => stripAttributes(item, blacklist));
    } else if (typeof obj === 'object' && obj !== null) {
      const result: any = {};
      for (const [key, value] of Object.entries(obj)) {
        if (!blacklist.includes(key)) {
          if (value instanceof Date) {
            // Preserve DateTime values
            result[key] = value;
          } else {
            result[key] = stripAttributes(value, blacklist);
          }
        }
      }
      return result;
    } else {
      return obj;
    }
  };