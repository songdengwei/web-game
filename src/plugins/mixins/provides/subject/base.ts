import { Observable, BehaviorSubject } from 'rxjs';

// interface BehaviorParamsState {}

export interface BehaviorParams {
  key: string;
  value?: any;
  state?: any;
}

export interface BehaviorSub {
  /**
   * subject的入参
   *
   * @param {BehaviorParams} params
   * @returns {Observable<any>}
   * @memberof BehaviorSub
   */
  getParams(): Observable<any>;
  pushParams(params: BehaviorParams): void;
  clearParams(): void;
}
