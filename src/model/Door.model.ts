import { EventSourcePolyfill } from 'event-source-polyfill';
import BaseModel from './BaseModel';

/**
 * @namespace cpro.ui5.__kunde__.__projekt__.model.Door
 */
export default class DoorModel extends BaseModel<any> {
  private eventSource: EventSource;

  constructor(args: any) {
    super(args)

    this.setDoorOpen(true);
    this.setTrucksPassed(0);
  }

  public subscribeToEvents() {
    if(this.eventSource) {
      this.eventSource.close();
    }
    this.eventSource = new EventSourcePolyfill('http://localhost:3199/api/subscribe', {
      headers: {
        authorization: 'Basic ' + btoa('user' + ':' + 'sekret')
      }
    });
  }

  public getSubscription() {
    return this.eventSource;
  }

  public setDoorOpen(value: boolean) {
    this.setProperty('/open', value);
  }

  public setTrucksPassed(value: number) {
    this.setProperty('/trucks', value);
  }
}