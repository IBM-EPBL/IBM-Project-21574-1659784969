/* eslint-disable react/display-name */
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import React from "react";
import * as Popover from "@radix-ui/react-popover";
import * as ScrollArea from "@radix-ui/react-scroll-area";

export default function Select() {
  return (
    <Popover.Root>
      <Popover.Trigger className="fixed sm:left-1/2 sm:right-1/2 sm:transform sm:translate-x-[-10.99rem]  sm:w-[350px] z-20 top-0 sm:top-[74.5px] w-full bg-gradient-to-b from-gradient-bg to-transparent opacity-90">
        <div className="text-white w-full py-3 px-2 flex items-center ml-0">
          <span className="pr-3 font-bold">Language</span>
          <ChevronDownIcon className="h-5 w-5 mt-1 inline text-white" />
        </div>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={5}
          className="PopoverContent"
        >
          <ScrollArea.Root className="ScrollAreaRoot">
            <ScrollArea.Viewport className="ScrollAreaViewport">
              <ul className="menu compact bg-base-100 p-2">
                <li>
                  <Link
                    href={{
                      pathname: "/",
                      query: {
                        lang: "english",
                      },
                    }}
                  >
                    English
                  </Link>
                </li>
                <li>
                  <Link
                    href={{
                      pathname: "/",
                      query: {
                        lang: "tamil",
                      },
                    }}
                  >
                    Tamil
                  </Link>
                </li>
                <li>
                  <Link
                    href={{
                      pathname: "/",
                      query: {
                        lang: "telugu",
                      },
                    }}
                  >
                    Telugu
                  </Link>
                </li>
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
