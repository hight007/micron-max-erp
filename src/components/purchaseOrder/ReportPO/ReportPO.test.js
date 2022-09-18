import React from "react";
import { shallow } from "enzyme";
import ReportPO from "./ReportPO";

describe("ReportPO", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<ReportPO />);
    expect(wrapper).toMatchSnapshot();
  });
});
