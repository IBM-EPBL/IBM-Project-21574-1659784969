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

export default function IndexPage({ data, next, nextIndex, activeTopic }: any) {
  const [space, setSpace] = useState(0);
  const [isSent, setIsSent] = useState(false);
  const [currentNext, setCurrentNext] = useState("");
  const [currentData, setCurrentData] = useState<any>([]);
  const [swiperRef, setSwiperRef] = useState();
  const [currentIndex, setCurrentIndex] = useState<any>();
  const [currentTopic, setCurrentTopic] = useState();

  useEffect(() => {
    if (!isMobile && typeof window !== "undefined") {
      setSpace(-80);
    }
  }, []);

  useEffect(() => {
    setCurrentNext(next);
  }, [next]);

  useEffect(() => {
    setCurrentData(data);
  }, [data]);

  useEffect(() => {
    setCurrentIndex(nextIndex);
  }, [nextIndex]);

  useEffect(() => {
    setCurrentTopic(activeTopic);
  }, [activeTopic]);

  const handleChange = async (e: any) => {
    if (isSent) {
      return;
    }
    const reachedEnd = e.realIndex > e.slides.length - 5;
    try {
      if (reachedEnd) {
        setIsSent(true);
        const ni = parseInt(currentIndex) + 16;
        const url = window.location.origin;
        const response = await fetch(`${url}/api/next`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: encodeURIComponent(currentNext),
            nextIndex: ni,
            activeTopic: currentTopic,
          }),
        });
        const json = await response.json();
        setCurrentIndex(ni);
        setCurrentTopic(json.activeTopic);

        if (json.data) {
          setCurrentData((old: []) => [...old, ...json.data]);
          setIsSent(false);
        }

        if (!json.next) {
          setIsSent(true);
          return;
        }

        if (json.next) {
          setCurrentNext(decodeURIComponent(json.next));
        }

        // @ts-ignore
        swiperRef?.update();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
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
        onSlideChange={handleChange}
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
  );
}

export async function getServerSideProps({ req, res, query }: any) {
  const lang = query.lang || "english";
  const topic = query.topic || "For You";

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );

  try {
    const url =
      process.env.NODE_ENV !== "production"
        ? "http://localhost:3000"
        : "https://theprint.me";

    const encodedUri = encodeURI(`lang=${lang}&topic=${topic}`);
    const response = await fetch(`${url}/api/headlines?${encodedUri}`);
    const { data, next, nextIndex, activeTopic } = await response.json();

    return { props: { data, next, nextIndex, activeTopic } };
  } catch (err) {
    console.log(err);
  }
  // Pass data to the page via props
}
