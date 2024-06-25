
import BaseController from './BaseController';
import { halleModel, messageModel } from '../model/provider';
import Dialog from 'sap/m/Dialog';

/**
 * @namespace cpro.ui5.__kunde__.__projekt__.controller.Home
 */
export default class HomeController extends BaseController {
  private homeDialogTableFilterPath =
    'cpro/ui5/__kunde__/__projekt__/view/Fragments/TableFilter';
  private homeDialogTableSorterPath =
    'cpro/ui5/__kunde__/__projekt__/view/Fragments/TodoTableSorter';

  private opcNodeDoorOpen: string = 'ns=1;b=40051TorGeoeffnet';
  private opcNodeTrucksPassed: string = 'ns=1;b=40052EingefahreneLkw';
  private connectionAttempts: number = 0;
  private timeout: any;

  private homeDialogs: Record<string, Dialog> = {};

  onInit() {
    messageModel.register(this);
    halleModel.register(this);
    this.subscribeToHalleEvents()
  }

  showDeviceNotification(title: string, text?: string) {
    Notification.requestPermission().then(() => {
      new Notification(title, {
        badge: 'assets/logo.jpg',
        body: text ?? null,
      })
    })
  }

  subscribeToHalleEvents() {
    halleModel.subscribeToEvents();
    this.registerDoorEvent();
    this.registerTruckEvent();
    this.registerCloseEvent();
  }

  registerDoorEvent() {
    halleModel.getSubscription().addEventListener(this.opcNodeDoorOpen, (event) => {
      const msg = `Das Tor von Halle 1 ist jetzt ${event.data === 'true' ? 'geöffnet' : 'geschlossen'}`
      this.showDeviceNotification('Meldung von Halle 1', msg);
      messageModel.addWarningMessage({
        message: msg,
      })
      halleModel.setDoorOpen(event.data === 'true')
    })
  }

  registerTruckEvent() {
    halleModel.getSubscription().addEventListener(this.opcNodeTrucksPassed, (event) => {
      messageModel.addInfoMessage({
        message: `Anzahl eingefahrener Lkw: ${event.data}`,
      })
      halleModel.setTrucksPassed(parseInt(event.data))
    })
  }

  registerCloseEvent() {
    halleModel.getSubscription().addEventListener('error', (event) => {
      if(!this.timeout) {
        this.timeout = setTimeout(() => {
          this.subscribeToHalleEvents();
          this.timeout = null;
        }, 5000)
      }
    })

    halleModel.getSubscription().addEventListener('close', (event) => {
      if(!this.timeout) {
        this.timeout = setTimeout(() => {
          this.subscribeToHalleEvents();
          this.timeout = null;
        }, 5000)
      }
    })
  }

  onPressInfoButton() {
    messageModel.addInfoMessage({
      message: 'You pressed the INFO button',
      description: 'Here goes an informatic description',
    });
  }
  onPressSuccessButton() {
    messageModel.addSuccessMessage({
      message: 'You pressed the SUCCESS button',
    });
  }
  onPressCancelButton() {
    messageModel.addErrorMessage({ message: 'You pressed the CANCEL button' });
  }
}
