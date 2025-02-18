import React from "react";

const Select = ({ children, ...props }) => {
  return <select {...props}>{children}</select>;
};

export default Select;