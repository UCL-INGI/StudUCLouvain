import { Page } from './app.po';
import { browser, by, element } from 'protractor';

describe('App', () => {
  let page: Page;

  beforeEach(() => {
    page = new Page();
  });

  describe('Starting App', () => {
    beforeEach(() => {
      page.navigateTo('/');
    });

    it('should have a title saying UCLCampus', function (done) {
      browser.driver.sleep(2000);
      var choice = element(by.id('LLN'));
      choice.click();
      var ok = element(by.id('okbutton'));
      ok.click();
      page.getTitle().then(title => {
        expect(title).toEqual('UCLCampus');
        done();
      });
    });
  });

  describe('Studies Page', () => {
    beforeEach(() => {
      page.navigateTo('/');
      browser.driver.sleep(2000);
      var link = element(by.id('study'));
      link.click();
      browser.driver.sleep(2000);
    });

    it('should have an error after bad password', () => {
      expect(browser.isElementPresent(element(by.id('error')))).not.toBeTruthy();
      var actions = browser.actions();
      actions.mouseMove(element(by.id('userField')));
      actions.click();
      actions.sendKeys("bdaubry");
      actions.mouseMove(element(by.id('passwordField')));
      actions.click();
      actions.sendKeys("coucou");

      actions.perform();
      var login = element(by.id('login'));
      login.click();
      var error = element(by.id('error'));
      expect(error.isDisplayed()).toBeTruthy();
    });

    it('should display list of courses and open a modal', () => {
      var segment = element(by.name('cours'));
      segment.click();
      var course = element(by.id('cours'));
      expect(course.isDisplayed()).toBeTruthy();

      var button = element(by.id('prompt'));
      button.click();
      browser.driver.sleep(1500);
      var alert = element(by.css('ion-alert'));
      expect(alert.isDisplayed()).toBeTruthy();

      var actions = browser.actions();
      actions.mouseMove(element(by.id('alert-input-0-0')));
      actions.click();
      actions.sendKeys("Trololol");
      actions.mouseMove(element(by.id('alert-input-0-1')));
      actions.click();
      actions.sendKeys("LFSAB1101");
      actions.perform();
      var ok = element(by.className('save'));
      ok.click();
      var cours = element(by.css("ion-item-sliding"));
      expect(cours.getText()).toContain('Trololol LFSAB1101');
    });


  });

});
