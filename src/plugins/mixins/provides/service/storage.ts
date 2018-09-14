export interface StorageBase {
  /**
   *
   *
   * @param {string} key
   * @param {*} value
   * @memberof StorageBase
   */
  setItem(key: string, value: any): void;
  getItem<T>(key: string): T | null;
}

class LocStorage implements StorageBase {
  setItem(key: string, value: any) {
    if (value) {
      value = JSON.stringify(value);
    }
    localStorage.setItem(key, value);
  }
  getItem<T>(key: string): T | null {
    let value: string = localStorage.getItem(key) || '';
    if (value && value != 'undefined' && value != 'null') {
      return <T>JSON.parse(value);
    }
    return null;
  }
}

class SesStorage implements StorageBase {
  setItem(key: string, value: any) {
    if (value) {
      value = JSON.stringify(value);
    }
    sessionStorage.setItem(key, value);
  }
  getItem<T>(key: string): T | null {
    let value: string = sessionStorage.getItem(key) || '';
    if (value && value != 'undefined' && value != 'null') {
      return <T>JSON.parse(value);
    }
    return null;
  }
}
export const locStorage = new LocStorage();
export const sesStorage = new SesStorage();
