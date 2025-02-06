import { useLocation } from "react-router-dom";
import { useState } from "react";
import { getUpdatedResponseFromRedis } from "../../utils/apiController.js";
import RefreshIcon from '@mui/icons-material/Refresh';
import "./HandleCacheButton.css";

export const HandleCacheButton = ({ onRefresh }) => {
  const location = useLocation();
  const pathname = location.pathname;

  const cacheKeys = {
    "/menu": "landing-page",
    "/bezeroak": "client",
    "/transakzioak": "transaction",
    "/aurreikuspenak": "predict",
  };

  const cacheKey = cacheKeys[pathname];

  const handleClick = async () => {
    if (cacheKey) {
        onRefresh(); // Volver a montar el Outlet
      await getUpdatedResponseFromRedis(cacheKey);

    }
  };

  if (!cacheKey) return null;

  return (
    <button className="HandleUpdateButton" onClick={handleClick}>
      <RefreshIcon/>
    </button>
  );
};