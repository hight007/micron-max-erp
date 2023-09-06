import React from "react";
import { shallow } from "enzyme";
import UpdateDo from "./UpdateDo";

describe("UpdateDo", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<UpdateDo />);
    expect(wrapper).toMatchSnapshot();
  });
});
