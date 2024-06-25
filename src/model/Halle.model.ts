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
    this.setData({
      trucks: 0,
      open: true,
      machines: {
        one: {
          ready: true,
          innerTemperature: 0,
          outerTemperature: 0,
          pressure: 0,
          producedQuantity: 0,
        },
        two: {
          ready: true,
          innerTemperature: 0,
          outerTemperature: 0,
          pressure: 0,
          producedQuantity: 0,
        },
        three: {
          ready: true,
          innerTemperature: 0,
          outerTemperature: 0,
          pressure: 0,
          producedQuantity: 0,
        }
      }
    })
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

  public setMachineBereitschaft(machine: "one" | "two" | "three", value: boolean) {
    this.setProperty(`/machines/${machine}/ready`, value);
  }

  public setMachineGefMengen(machine: "one" | "two" | "three", value: boolean) {
    this.setProperty(`/machines/${machine}/quantity`, value);
  }

  public setMachineInnerTemp(machine: "one" | "two" | "three", value: boolean) {
    this.setProperty(`/machines/${machine}/inner-temp`, value);
  }

  public setMachineOuterTemp(machine: "one" | "two" | "three", value: boolean) {
    this.setProperty(`/machines/${machine}/outer-temp`, value);
  }

  public setMachinePressure(machine: "one" | "two" | "three", value: boolean) {
    this.setProperty(`/machines/${machine}/pressure`, value);
  }
}