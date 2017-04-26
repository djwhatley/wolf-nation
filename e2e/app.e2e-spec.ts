import { WolfNationPage } from './app.po';

describe('wolf-nation App', () => {
  let page: WolfNationPage;

  beforeEach(() => {
    page = new WolfNationPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
