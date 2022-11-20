import { NewspaperIcon } from "@heroicons/react/24/solid";
import * as Popover from "@radix-ui/react-popover";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useRouter } from "next/router";

export default function ChooseLang({ swiperRef }: any) {
  const router = useRouter();

  const handleClick = (topic = "For You") => {
    swiperRef?.slideTo(0);
    router.query.topic = topic;
    router.push(router);

    const body = document.querySelector("body");
    body?.click();
  };

  const TOPICS = [
    "For You",
    "Business",
    "Entertainment",
    "Technology",
    "Politics",
    "Movies",
    "India",
  ];

  return (
    <Popover.Root>
      <Popover.Trigger>
        <div className="flex items-center flex-col cursor-pointer pt-4 mb-4">
          <NewspaperIcon className="h-5 w-5 mt-1 text-gray-500" />
          <p className="text-slate-400 text-xs">Topic</p>
        </div>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="PopoverContent">
          <ScrollArea.Root className="ScrollAreaRoot">
            <ScrollArea.Viewport className="ScrollAreaViewport">
              <ul className="menu compact bg-base-100 p-2">
                {TOPICS.map((itm: string, i: number) => (
                  <li key={`TOPICS_RENDERED_${i}`}>
                    <a onClick={() => handleClick(itm)}>{itm}</a>
                  </li>
                ))}
              </ul>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar
              className="ScrollAreaScrollbar bg-slate-200"
              orientation="vertical"
            >
              <ScrollArea.Thumb className="ScrollAreaThumb bg-slate-600" />
            </ScrollArea.Scrollbar>
            <ScrollArea.Corner className="ScrollAreaCorner" />
          </ScrollArea.Root>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
