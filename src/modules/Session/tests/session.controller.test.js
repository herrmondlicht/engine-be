import * as sessionControllerTest from "../session.controller";

describe("session controller", () => {
  it("not null/undefined return of authenticateUser when correct params are passed", () => {
    const username = process.env.USERNAME;
    const password  = process.env.PASSWORD;
    
    const response = sessionControllerTest.authenticateUser({username, password});
    expect(response).not.toBe(undefined);
  })

  it("null/undefined return of authenticateUser when wrong params are passed", () => {
    const username = "random123";
    const password  = "random1234";
    
    const response = sessionControllerTest.authenticateUser({username, password});
    expect(response).toBe(undefined);
  })
})