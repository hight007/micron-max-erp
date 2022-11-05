import React from "react";
import { shallow } from "enzyme";
import CreateNewPO from "./CreateNewPO";

describe("CreateNewPO", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<CreateNewPO />);
    expect(wrapper).toMatchSnapshot();
  });
});
