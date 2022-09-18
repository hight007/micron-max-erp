import React from "react";
import { shallow } from "enzyme";
import JobCards from "./JobCards";

describe("JobCards", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<JobCards />);
    expect(wrapper).toMatchSnapshot();
  });
});
