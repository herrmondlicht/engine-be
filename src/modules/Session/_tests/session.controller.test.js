import * as sessionControllerTest from '../session.controller';

const dependency = {
  SECRET: 'abcd',
  PORTAL_USERNAME: 'username',
  PORTAL_PASSWORD: 'password',
};

describe('session controller', () => {
  it('not null/undefined return of authenticateUser when correct params are passed', () => {
    const username = 'username';
    const password = 'password';

    const response = sessionControllerTest.authenticateUser(dependency)({ username, password });

    expect(response).not.toBe(undefined);
    expect(Object.keys(response)).toContain('token');
  });

  it('null/undefined return of authenticateUser when wrong params are passed', () => {
    const username = 'random123';
    const password = 'random1234';
    try {
      sessionControllerTest.authenticateUser(dependency)({ username, password });
    } catch (e) {
      expect(e.toString()).toBe('Error: Wrong username/password');
    }
  });
});
