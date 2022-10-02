import React from "react";
import { shallow } from "enzyme";
import JobTrackingCard from "./JobTrackingCard";

describe("JobTrackingCard", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<JobTrackingCard />);
    expect(wrapper).toMatchSnapshot();
  });
});
