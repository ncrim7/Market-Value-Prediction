import React from "react";

const InfoCard = ({ title, content }) => {
  return (
    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
      <h3 className="text-lg font-semibold mb-3 text-purple-300">{title}</h3>
      <p className="text-sm opacity-80 leading-relaxed">{content}</p>
    </div>
  );
};

export default InfoCard;