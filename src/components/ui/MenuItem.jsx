import React from "react";

const MenuItem = ({ children, ...props }) => {
  return <option {...props}>{children}</option>;
};

export default MenuItem;
