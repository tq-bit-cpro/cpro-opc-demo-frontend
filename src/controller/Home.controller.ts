
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
  private opcMachines = [{
    name: 'one',
    nsBereitschaft: 'ns=1;b=40011Bereitschaft',
    nsThermoInner: 'ns=1;b=40012ThermoInnen',
    nsThermoOuter: 'ns=1;b=40013ThermoAussen',
    nsGefertigteMengen: 'ns=1;b=40014GefMengen',
    nsDruck: 'ns=1;b=40015DruckVorlauf',
  },
  {
    name: 'two',
    nsBereitschaft: 'ns=1;b=40021Bereitschaft',
    nsThermoInner: 'ns=1;b=40022ThermoInnen',
    nsThermoOuter: 'ns=1;b=40023ThermoAussen',
    nsGefertigteMengen: 'ns=1;b=40024GefMengen',
    nsDruck: 'ns=1;b=40025DruckVorlauf',
  },
  {
    name: 'three',
    nsBereitschaft: 'ns=1;b=40031Bereitschaft',
    nsThermoInner: 'ns=1;b=40032ThermoInnen',
    nsThermoOuter: 'ns=1;b=40033ThermoAussen',
    nsGefertigteMengen: 'ns=1;b=40034GefMengen',
    nsDruck: 'ns=1;b=40035DruckVorlauf',
  }]
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
    this.registerMachineEvent();
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

  registerMachineEvent() {
    this.opcMachines.forEach(machine => {
      console.log(`registering event for ${machine.name}`)
      const name = machine.name as "one" | "two" | "three"

      // Event for readiness
      halleModel.getSubscription().addEventListener(machine.nsBereitschaft, (event) => {
        halleModel.setMachineBereitschaft(name, event.data)
      })

      // Event for quantities
      halleModel.getSubscription().addEventListener(machine.nsGefertigteMengen, (event) => {
        halleModel.setMachineGefMengen(name, event.data)
      })

      // Event for pressure
      halleModel.getSubscription().addEventListener(machine.nsDruck, (event) => {
        halleModel.setMachinePressure(name, event.data)
      })

      // Event for inner temp
      halleModel.getSubscription().addEventListener(machine.nsThermoInner, (event) => {
        halleModel.setMachineInnerTemp(name, event.data)
      })

      // Event for outer temp
      halleModel.getSubscription().addEventListener(machine.nsThermoOuter, (event) => {
        halleModel.setMachineOuterTemp(name, event.data)
      })
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
