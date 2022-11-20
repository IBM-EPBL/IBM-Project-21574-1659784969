import { BookmarkSquareIcon, HomeIcon } from "@heroicons/react/24/solid";

import { useRouter } from "next/router";
import ChooseTopic from "./chooseTopic";

export default function BottomNav({ swiperRef }: any) {
  const router = useRouter();

  const refreshData = () => {
    router.replace(router.asPath);
  };

  const handleHomeClick = () => {
    if (window.location.pathname === "/") {
      // @ts-ignore
      swiperRef?.slideTo(0);
      refreshData();
    }

    router.push("/");
  };

  const handleBookamrkClick = () => {
    if (window.location.pathname === "/bookmarks") {
      // @ts-ignore
      swiperRef?.slideTo(0);
      refreshData();
    }

    router.push("/bookmarks");
  };
  return (
    <div className="fixed sm:left-1/2 sm:right-1/2 sm:transform sm:translate-x-[-10.99rem] sm:w-[350px] z-20 bottom-0 sm:top-[650px] h-20 w-full bg-gradient-to-b from-transparent to-gradient-bg opacity-90">
      <div className="flex flex-row justify-center gap-12 ">
        <div
          onClick={handleHomeClick}
          className="flex items-center flex-col cursor-pointer pt-4 mb-4 tooltip"
          data-tip="Home"
        >
          <HomeIcon
            className={`h-5 w-5  ${
              router.pathname === "/" ? "text-white" : "text-gray-500"
            }`}
          />
          <p className="text-slate-500 text-xs mt-1">Home</p>
        </div>
        <div
          onClick={handleBookamrkClick}
          className="flex items-center flex-col cursor-pointer pt-4 mb-4 tooltip"
          data-tip="Bookmarks"
        >
          <BookmarkSquareIcon
            className={`h-5 w-5 ${
              router.pathname === "/bookmarks" ? "text-white" : "text-gray-500"
            }`}
          />
          <p className="text-slate-400 text-xs mt-1">Bookmarks</p>
        </div>
        <ChooseTopic swiperRef={swiperRef} />
      </div>
    </div>
  );
}
