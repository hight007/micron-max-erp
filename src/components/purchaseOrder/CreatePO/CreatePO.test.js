import React from "react";
import { shallow } from "enzyme";
import CreatePO from "./CreatePO";

describe("CreatePO", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<CreatePO />);
    expect(wrapper).toMatchSnapshot();
  });
});
