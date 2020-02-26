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
  public is(): boolean {
    return true;
  }

  public win(): Window {
    return window;
  }

  public timeout(callback: any, timer: number): any {
    return setTimeout(callback, timer);
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

export class NavParamsMock {
  data = {};

  get(param) {
    return this.data[param];
  }
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

export class MockCacheStorageService extends CacheStorageService {
    constructor(a, b) {
        super(a, b);
    }

    public ready() {
        return new Promise<LocalForage>((resolve) => {
            resolve();
        });
    }
}


export class MockCacheService {

    constructor(_storage) {
    }
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
}
