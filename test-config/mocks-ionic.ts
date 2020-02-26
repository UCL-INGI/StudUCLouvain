import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { CacheStorageService } from 'ionic-cache/dist/cache-storage';
import { App, Config, DeepLinker, Modal, ModalController, Toast, ToastController, ViewController } from "ionic-angular";

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
      resolve('READY');
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
      paddingLeft: '10',
      paddingTop: '10',
      paddingRight: '10',
      paddingBottom: '10'
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
    return document['activeElement'];
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
        model: 'something'
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

export class DeepLinkerMock {
}

export class MenuMock {
  public static instance(): any {
    const instance = jasmine.createSpyObj('Menu', ['blank', 'open', 'close']);
    instance['content'] = 'menu content';
    instance['enabled'] = true;
    instance['id'] = 'menuId';
    instance['persistent'] = true;
    instance['side'] = 'left';
    instance['swipeEnabled'] = true;
    instance['type'] = 'reveal';

    instance.open.and.returnValue(Promise.resolve(true));
    instance.close.and.returnValue(Promise.resolve(true));

    return instance;
  }
}

export class MenuControllerMock {
  public static instance(menu?: MenuMock): any {
    const m = menu || MenuMock.instance();
    const instance = jasmine.createSpyObj('MenuController', [
      'close',
      'enable',
      'get',
      'getMenus',
      'getOpen',
      'isEnabled',
      'isOpen',
      'open',
      'swipeEnable',
      'toggle'
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

const METHODS2 = ['present', 'dismiss', 'onDidDismiss'];

export class AlertMock extends BaseMock {
  constructor() {
    super('Alert', METHODS2);

    this.spyObj.present.and.returnValue(Promise.resolve());
  }

  public static instance(): any {
    return new AlertMock();
  }
}

const METHODS = ['create'];

export class AlertControllerMock extends BaseMock {
  constructor(alertMock?: AlertMock) {
    super('AlertController', METHODS);
    this.spyObj.create.and.returnValue(alertMock || new AlertMock());
  }

  public static instance(alertMock?: AlertMock): any {
    return new AlertControllerMock(alertMock);
  }
}

const METHODS3 = ['present', 'dismiss', 'setContent', 'setSpinner'];

export class LoadingMock extends BaseMock {
  constructor() {
    super('Loading', METHODS3);
    this.spyObj.present.and.returnValue(Promise.resolve());
  }

  public static instance(): any {
    return new LoadingMock();
  }
}

export class LoadingControllerMock {
  public static instance(loading?: LoadingMock): any {
    const instance = jasmine.createSpyObj('LoadingController', ['create']);
    instance.create.and.returnValue(loading || LoadingMock.instance());

    return instance;
  }
}

export class UserServiceMock {
  constructor() {
  }
  storage = {
    get() {
      return new Promise(() => {});
    }
  };
  getCampus() {
    return 'LLN';
  }

  getStringData() {}
}

export class Wso2ServiceMock {
  constructor() {
  }

  getToken() {
    return 'XXXX';
  }
}

export class RssServiceMock {
  constructor() {
  }
}

export class MockCacheStorageService extends CacheStorageService {
    constructor(a, b) {
        super(a, b);
    }

    public ready() {
        let promise: Promise<LocalForage>;
        return new Promise<LocalForage>((resolve, reject) => {
            resolve();
        });
    }
}


export class MockCacheService {
    _storage: MockCacheStorageService;

    constructor(_storage) {
    }

    getItem() {
        return new Promise<any>((resolve, reject) => {
            resolve();
        });
    }

    removeItem() {
    }

    saveItem() {
    }
}

export function newMockCacheService() {
    let _storage: MockCacheStorageService;
    return new MockCacheService(_storage);
}

export class ModalControllerMock extends ModalController {
    create(component: any) {
      return new Modal(null, null, null, null, null, null);
    }

    dismiss() {
        return new Promise<boolean>(() => {
        });
    }
}

export class ToastControllerMock extends ToastController {
    create() {
      return new Toast(null, null, null);
    }

    dismiss() {
        return new Promise<boolean>(() => {
        });
    }
}

export function newToastControllerMock() {
    let app: App, conf: Config;
    return new ToastControllerMock(app, conf);
}

export function newModalControllerMock() {
    let app: App, conf: Config, dl: DeepLinker;
    return new ModalControllerMock(app, conf, dl);
}

export class ViewControllerMock extends ViewController {
    dismiss() {
        return new Promise<boolean>(() => {
        });
    }
}

export function newViewControllerMock() {
    let app: App, conf: Config;
    return new ViewControllerMock(app, conf);
}

export class MockAlert {
    public visible: boolean;
    public header: string;
    public message: string;

    constructor(props: any) {
        Object.assign(this, props);
        this.visible = false;
    }

    present() {
        this.visible = true;
        return Promise.resolve();
    }

    dismiss() {
        this.visible = false;
        return Promise.resolve();
    }
}

export class MockAlertController {
    public created: MockAlert[];

    constructor() {
        this.created = [];
    }

    create(props: any): Promise<any> {
        const toRet = new MockAlert(props);
        this.created.push(toRet);
        return Promise.resolve(toRet);
    }

    getLast() {
        if (!this.created.length) {
            return null;
        }
        return this.created[this.created.length - 1];
    }
}
