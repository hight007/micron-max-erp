import React from "react";
import { shallow } from "enzyme";
import CreateDo from "./CreateDo";

describe("CreateDo", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<CreateDo />);
    expect(wrapper).toMatchSnapshot();
  });
});
