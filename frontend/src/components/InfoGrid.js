import React from "react";

const InfoGrid = () => {
	const features = [
		{
			icon: "🎯",
			title: "Yüksek Doğruluk",
			desc: "Makine öğrenmesi algoritmaları ile %85+ doğruluk oranında tahmin yapabilir.",
		},
		{
			icon: "⚡",
			title: "Hızlı Sonuç",
			desc: "Gelişmiş API teknolojisi ile saniyeler içinde güvenilir tahmin sonuçları alın.",
		},
		{
			icon: "📊",
			title: "Kapsamlı Analiz",
			desc: "16 farklı performans kriterini analiz ederek en doğru piyasa değerini hesaplar.",
		},
		{
			icon: "🔒",
			title: "Güvenilir Veri",
			desc: "Profesyonel lig verilerine dayalı, sürekli güncellenen model altyapısı.",
		},
	];

	return (
		<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
			{features.map((feature, index) => (
				<div
					key={index}
					className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:-translate-y-2 hover:shadow-xl hover:shadow-white/10 transition-all duration-300"
				>
					<div className="text-2xl mb-3">{feature.icon}</div>
					<h3 className="text-lg font-semibold mb-2 text-purple-300">
						{feature.title}
					</h3>
					<p className="text-sm opacity-80 leading-relaxed">
						{feature.desc}
					</p>
				</div>
			))}
		</div>
	);
};

export default InfoGrid;