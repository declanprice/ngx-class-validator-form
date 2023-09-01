import { AppComponent } from './app.component';

import { render } from "@testing-library/angular";

describe('AppComponent', () => {

  it('should create the app', async() => {
    const { getByText } = await render(AppComponent);

    expect(getByText('app is running!')).toBeInTheDocument();
  });
});
