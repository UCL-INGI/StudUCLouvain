import { BehaviorSubject } from 'rxjs/Rx';

/**
 * @class NavParamsMock
 */
export class NavParamsMock {
  data: Object = { Example: 1234 };
}

/**
 * @class ConfigMock
 */
export class ConfigMock {
  public get(): any {
    return '';
  }

  public getBoolean(): boolean {
    return true;
  }

  public getNumber(): number {
    return 1;
  }
}

/**
 * @class FormMock
 */
export class FormMock {
  public register(): any {
    return true;
  }
}

/**
 * @class NavMock
 */
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
      'instance': {
        'model': 'something',
      },
    };
  }

  public setRoot(): any {
    return true;
  }
}

/**
 * @class PlatformMock
 */ new BehaviorSubject(this.HOME_VIEW);
export class PlatformMock {
  public ready(): Promise<{ String }> {
    return new Promise((resolve) => {
      return 'READY';
    });
  }

  public registerBackButtonAction(fn: Function, priority?: number): Function {
    return (() => true);
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
      paddingBottom: '10',
    };
  }

  public onResize(callback: any) {
    return callback;
  }

  public registerListener(ele: any, eventName: string, callback: any): Function {
    return (() => true);
  }

  public win(): Window {
    return window;
  }

  public raf(callback: any): number {
    return 1;
  }
}


/**
 * @class MenuMock
 */
export class MenuMock {
  public close(): any {
    return new Promise((resolve: Function) => {
      resolve();
    });
  }
}