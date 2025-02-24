import React from "react";
import "../styles/Balance.css";

const BalanceBar = ({ balance, maxBalance }) => {
  if (maxBalance === 0) return null;

  const balancePercentage = (Math.abs(balance) / maxBalance) * 50;

  return (
    <div className="balance-bar">
      <div
        className={`balance-fill ${balance >= 0 ? "positive" : "negative"}`}
        style={{
          width: `${balancePercentage}%`,
          left: balance < 0 ? `${50 - balancePercentage}%` : "50%",
        }}
      ></div>
      <div className="balance-midline"></div>
    </div>
  );
};

export default BalanceBar;
