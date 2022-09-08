import React from "react";
import { shallow } from "enzyme";
import CreateNewUser from "./CreateNewUser";

describe("CreateNewUser", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<CreateNewUser />);
    expect(wrapper).toMatchSnapshot();
  });
});
