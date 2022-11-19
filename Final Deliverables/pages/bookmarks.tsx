import Header from "@components/header";
import News from "@components/news";
import { isMobile } from "react-device-detect";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/bundle";

import "swiper/css";

import { useEffect, useState } from "react";
import BottomNav from "@components/bottomNav";
import Select from "@components/Select";
import DialogComponent from "@components/Dialog";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

export default function IndexPage({ data }: any) {
  const [space, setSpace] = useState(0);
  const [currentData, setCurrentData] = useState<any>([]);
  const [swiperRef, setSwiperRef] = useState();

  useEffect(() => {
    if (!isMobile && typeof window !== "undefined") {
      setSpace(-80);
    }
  }, []);

  useEffect(() => {
    // setCurrentData(data);
    const parsed = JSON.parse(data);
    const filtered = parsed.map((item: any) => JSON.parse(item.CONTENT));

    setCurrentData(filtered);
  }, [data]);

  return data ? (
    <>
      <Header />

      <Select />
      <Swiper
        // @ts-ignore
        onSwiper={setSwiperRef}
        spaceBetween={space}
        direction={"vertical"}
        mousewheel={true}
        className="mySwiper"
      >
        {currentData?.length &&
          currentData.map((item: any, i: number) => {
            return (
              <SwiperSlide key={`${Date.now()}_${item.id}_${i}`}>
                <News data={item} />
              </SwiperSlide>
            );
          })}
      </Swiper>

      <BottomNav swiperRef={swiperRef} />

      <DialogComponent />
    </>
  ) : (
    <div>Loading...</div>
  );
}

export async function getServerSideProps({ req, res, query }: any) {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );

  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/api/auth/signin",
      },
    };
  }

  try {
    const response = await fetch(`${process.env.SERVER_URL}getbookmarks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: session.user?.email,
      }),
    });
    const data = await response.json();

    if (!data.success)
      return {
        props: { data: null },
      };

    return { props: { data: data.bookmarks } };
  } catch (err) {
    console.log(err);
  }
}
