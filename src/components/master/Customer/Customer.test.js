import React from "react";
import { shallow } from "enzyme";
import Customer from "./Customer";

describe("Customer", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<Customer />);
    expect(wrapper).toMatchSnapshot();
  });
});
