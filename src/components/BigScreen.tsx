"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay } from "swiper/modules";
import type { CampaignData } from "../app/page";

export default function BigScreen({
  initialData,
}: {
  initialData: CampaignData;
}) {
  const [data, setData] = useState<CampaignData>(initialData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/data");
        const newData = await response.json();
        setData(newData);
      } catch (error) {
        console.error("Update error:", error);
      } finally {
        setLoading(false);
      }
    };

    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!data) return <div className="text-white">Loading initial data...</div>;

  return (
    <div
      className="h-screen w-screen overflow-hidden"
      style={{ backgroundColor: data.bodyBackgroundColor }}
    >
      <header
        className="flex items-center justify-between p-4"
        style={{
          backgroundColor: "#023C40",
          color: "#FFFFFF",
        }}
      >
        <img
          src={data.headerLeftImageUrl}
          alt="Header left"
          className="h-24 object-contain"
          style={{ width: `${data.headerLeftImageSize * 4}rem` }}
        />
        <h1
          className="text-center font-bold uppercase"
          style={{ fontSize: `${data.headerFontSize}rem` }}
        >
          {data.title}
        </h1>
        <img
          src={data.headerRightImageUrl}
          alt="Header right"
          className="h-24 object-contain"
          style={{ width: `${data.headerRightImageSize * 4}rem` }}
        />
      </header>

      {loading && (
        <div className="fixed top-20 right-4 bg-black/50 text-white px-4 py-2 rounded-lg">
          Updating...
        </div>
      )}

      <div className="h-[calc(100vh-8rem)] p-4">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={30}
          slidesPerView={3}
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          className="h-full"
        >
          {data.lotList.map((lot, index) => (
            <SwiperSlide key={index}>
              <div className="h-full flex flex-col bg-white rounded-lg overflow-hidden shadow-xl">
                <div className="flex-1 relative">
                  <img
                    src={lot.imageUrl}
                    alt={lot.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4 space-y-2">
                  <p className="text-sm font-semibold text-gray-600">
                    {lot.type.charAt(0) + lot.type.slice(1).toLowerCase()} Bid
                  </p>

                  <h2
                    className="font-bold truncate"
                    style={{
                      fontSize: `${data.verticalLotCardFontSize * 0.5}rem`,
                    }}
                  >
                    {lot.title.slice(
                      0,
                      data.verticalLotCardTitleCharacterLimit
                    )}
                    {lot.title.length >
                      data.verticalLotCardTitleCharacterLimit && "..."}
                  </h2>

                  <div className="space-y-1">
                    <p className="text-sm">
                      Minimum Bid:{" "}
                      <span className="font-bold">
                        {new Intl.NumberFormat("en-GB", {
                          style: "currency",
                          currency: data.currencyCode,
                        }).format(lot.minimumBid)}
                      </span>
                    </p>
                    <p className="text-sm">
                      Bids Received:{" "}
                      <span className="font-bold">{lot.bids.length}</span>
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
