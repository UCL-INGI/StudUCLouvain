import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

export abstract class BaseMock {
  protected spyObj: any;

  constructor(baseName: string, methodNames: any[]) {
    this.spyObj = jasmine.createSpyObj(baseName, methodNames);

    methodNames.forEach(methodName => {
      this[methodName] = this.spyObj[methodName];
    });
  }
}

export class PlatformMock {
  public ready(): Promise<string> {
    return new Promise(resolve => {
      resolve("READY");
    });
  }

  public getQueryParam() {
    return true;
  }

  public registerBackButtonAction(fn: Function, priority?: number): Function {
    return () => true;
  }

  public hasFocus(ele: HTMLElement): boolean {
    return true;
  }

  public doc(): HTMLDocument {
    return document;
  }

  public is(): boolean {
    return true;
  }

  public getElementComputedStyle(container: any): any {
    return {
      paddingLeft: "10",
      paddingTop: "10",
      paddingRight: "10",
      paddingBottom: "10"
    };
  }

  public onResize(callback: any) {
    return callback;
  }

  public registerListener(
    ele: any,
    eventName: string,
    callback: any
  ): Function {
    return () => true;
  }

  public win(): Window {
    return window;
  }

  public raf(callback: any): number {
    return 1;
  }

  public timeout(callback: any, timer: number): any {
    return setTimeout(callback, timer);
  }

  public cancelTimeout(id: any) {
    // do nothing
  }

  public getActiveElement(): any {
    return document["activeElement"];
  }
}

export class StatusBarMock extends StatusBar {
  styleDefault() {
    return;
  }
}

export class SplashScreenMock extends SplashScreen {
  hide() {
    return;
  }
}

export class NavMock {
  public pop(): any {
    return new Promise(function (resolve: Function): void {
      resolve();
    });
  }

  public push(): any {
    return new Promise(function (resolve: Function): void {
      resolve();
    });
  }

  public getActive(): any {
    return {
      instance: {
        model: "something"
      }
    };
  }

  public setRoot(): any {
    return true;
  }

  public registerChildNav(nav: any): void {
    return;
  }
}

export class NavParamsMock {
  data = {};

  get(param) {
    return this.data[param];
  }
}

export class TranslateServiceMock {
  data = {};
  public get(key: any): any {
    return this.data[key];
  }
}

export class DeepLinkerMock { }

export class MenuMock {
  public static instance(): any {
    let instance = jasmine.createSpyObj("Menu", ["blank", "open", "close"]);
    instance["content"] = "menu content";
    instance["enabled"] = true;
    instance["id"] = "menuId";
    instance["persistent"] = true;
    instance["side"] = "left";
    instance["swipeEnabled"] = true;
    instance["type"] = "reveal";

    instance.open.and.returnValue(Promise.resolve(true));
    instance.close.and.returnValue(Promise.resolve(true));

    return instance;
  }
}

export class MenuControllerMock {
  public static instance(menu?: MenuMock): any {
    let m = menu || MenuMock.instance();
    let instance = jasmine.createSpyObj("MenuController", [
      "close",
      "enable",
      "get",
      "getMenus",
      "getOpen",
      "isEnabled",
      "isOpen",
      "open",
      "swipeEnable",
      "toggle"
    ]);
    instance.close.and.returnValue(Promise.resolve());
    instance.enable.and.returnValue(m);
    instance.get.and.returnValue(m);
    instance.getMenus.and.returnValue([m]);
    instance.getOpen.and.returnValue(m);
    instance.isEnabled.and.returnValue(true);
    instance.isOpen.and.returnValue(false);
    instance.open.and.returnValue(Promise.resolve());
    instance.swipeEnable.and.returnValue(m);
    instance.toggle.and.returnValue(Promise.resolve());

    return instance;
  }
}

const METHODS = ["create"];

export class AlertControllerMock extends BaseMock {
  constructor(alertMock?: AlertMock) {
    super("AlertController", METHODS);
    this.spyObj.create.and.returnValue(alertMock || new AlertMock());
  }

  public static instance(alertMock?: AlertMock): any {
    return new AlertControllerMock(alertMock);
  }
}

const METHODS2 = ["present", "dismiss", "onDidDismiss"];

export class AlertMock extends BaseMock {
  constructor() {
    super("Alert", METHODS2);

    this.spyObj.present.and.returnValue(Promise.resolve());
  }

  public static instance(): any {
    return new AlertMock();
  }
}

export class LoadingControllerMock {
  public static instance(loading?: LoadingMock): any {
    let instance = jasmine.createSpyObj("LoadingController", ["create"]);
    instance.create.and.returnValue(loading || LoadingMock.instance());

    return instance;
  }
}

const METHODS3 = ["present", "dismiss", "setContent", "setSpinner"];
export class LoadingMock extends BaseMock {
  constructor() {
    super("Loading", METHODS3);
    this.spyObj.present.and.returnValue(Promise.resolve());
  }

  public static instance(): any {
    return new LoadingMock();
  }
}

export class UserServiceMock {
  constructor() { }
  getCampus() {
    return "LLN";
  }
}

export class Wso2ServiceMock {
  constructor() { }
  getToken() {
    return "XXXX";
  }
}

export class RssServiceMock {
  constructor() { }
}
