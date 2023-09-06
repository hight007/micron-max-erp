import React from "react";
import { shallow } from "enzyme";
import ReportDo from "./ReportDo";

describe("ReportDo", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<ReportDo />);
    expect(wrapper).toMatchSnapshot();
  });
});
