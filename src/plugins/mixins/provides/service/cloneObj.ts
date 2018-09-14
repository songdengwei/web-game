export const cloneObj = function(obj: any) {
  // Handle the 3 simple types, and null or undefined
  if (null == obj || 'object' != typeof obj) return obj;

  // Handle Date
  if (obj instanceof Date) {
    let copy: any = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }

  // Handle Array
  if (obj instanceof Array) {
    let copy: any = [];
    for (let i = 0, len = obj.length; i < len; ++i) {
      copy[i] = cloneObj(obj[i]);
    }
    return copy;
  }

  // Handle Object
  if (obj instanceof Object) {
    let copy: any = {};
    for (let attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = cloneObj(obj[attr]);
    }
    return copy;
  }

  throw new Error("Unable to copy obj! Its type isn't supported.");
};
