import React from "react";
import { shallow } from "enzyme";
import UpdatePO from "./UpdatePO";

describe("UpdatePO", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<UpdatePO />);
    expect(wrapper).toMatchSnapshot();
  });
});
