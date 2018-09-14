import { Observable, BehaviorSubject } from 'rxjs';
import { BehaviorSub, BehaviorParams } from '@/plugins/mixins/provides/subject/base';

class AjaxNoticeThreeService implements BehaviorSub {
  private subject = new BehaviorSubject<any>(0);

  pushParams(params: BehaviorParams) {
    this.subject.next(params);
  }

  clearParams() {
    this.subject.next(0);
  }

  getParams(): Observable<any> {
    return this.subject.asObservable();
  }
}

export default new AjaxNoticeThreeService();
