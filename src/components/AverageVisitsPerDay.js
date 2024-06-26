import React from "react";
import { useTranslation } from "react-i18next";

const AverageVisitsPerDay = ({ average }) => {
    const { t } = useTranslation();

  return (
    <div className="average-visits-container">
      <h3>{t('average')}</h3>
      <p>{average}</p>
    </div>
  );
};

export default AverageVisitsPerDay;
