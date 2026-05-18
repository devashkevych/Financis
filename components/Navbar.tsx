"use client";

import Link from "next/link";
import { useUser } from "@/lib/context/UserContext";

export default function Navbar() {
  const { user } = useUser();
  const isLogged = !!user;

  return (
    <nav
      className={
        isLogged
          ? `fixed z-1 bottom-0 left-0 md:static md:top-0 w-full bg-[#231c2c] pt-4`
          : "hidden"
      }
    >
      <div>
        <div className="hidden md:flex justify-evenly">
          <Link href="/profile">Profile</Link>
          <Link href="/transactions">Transactions</Link>
          <Link href="/dashboard">Dashboard</Link>
        </div>
        <div className="flex justify-evenly pb-2 md:hidden">
          <Link
            href="/profile"
            className="flex flex-col items-center text-gray-400 fill-gray-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="40px"
              viewBox="0 -960 960 960"
              width="40px"
            >
              <path d="M370.33-524.33Q326.67-568 326.67-634t43.66-109.67Q414-787.33 480-787.33t109.67 43.66Q633.33-700 633.33-634t-43.66 109.67Q546-480.67 480-480.67t-109.67-43.66ZM160-160v-100q0-36.67 18.5-64.17T226.67-366q65.33-30.33 127.66-45.5 62.34-15.17 125.67-15.17t125.33 15.5q62 15.5 127.34 45.17 30.33 14.33 48.83 41.83T800-260v100H160Zm66.67-66.67h506.66V-260q0-14.33-8.16-27-8.17-12.67-20.5-19-60.67-29.67-114.34-41.83Q536.67-360 480-360t-111 12.17Q314.67-335.67 254.67-306q-12.34 6.33-20.17 19-7.83 12.67-7.83 27v33.33Zm315.16-345.5Q566.67-597 566.67-634t-24.84-61.83Q517-720.67 480-720.67t-61.83 24.84Q393.33-671 393.33-634t24.84 61.83Q443-547.33 480-547.33t61.83-24.84ZM480-634Zm0 407.33Z" />
            </svg>
            <span className="text-xs">Profile</span>
          </Link>

          <Link
            href="/transactions"
            className="flex flex-col items-center text-gray-400 fill-gray-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="40px"
              viewBox="0 -960 960 960"
              width="40px"
            >
              <path d="M448.67-276h66.66v-43.33h45.34q15.66 0 25.83-11.84 10.17-11.83 10.17-27.5v-116.49q0-16.51-10.17-28.01t-25.83-11.5H430V-574h166.67v-66.67h-81.34V-684h-66.66v43.33h-46q-15.67 0-27.5 11.84-11.84 11.83-11.84 28.24v115.85q0 16.41 11.84 26.57Q387-448 402.67-448H530v62H363.33v66.67h85.34V-276Zm-302 116q-27 0-46.84-19.83Q80-199.67 80-226.67v-506.66q0-27 19.83-46.84Q119.67-800 146.67-800h666.66q27 0 46.84 19.83Q880-760.33 880-733.33v506.66q0 27-19.83 46.84Q840.33-160 813.33-160H146.67Zm0-66.67h666.66v-506.66H146.67v506.66Zm0 0v-506.66 506.66Z" />
            </svg>
            <span className="text-xs">Transactions</span>
          </Link>

          <Link
            href="/dashboard"
            className="flex flex-col items-center text-gray-400 fill-gray-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="40px"
              viewBox="0 -960 960 960"
              width="40px"
            >
              <path d="M186.67-120q-27 0-46.84-19.83Q120-159.67 120-186.67V-840h66.67v653.33H840V-120H186.67ZM250-250v-342.67h132.67V-250H250Zm198.67 0v-546.67h132.66V-250H448.67Zm196 0v-180h132.66v180H644.67Z" />
            </svg>
            <span className="text-xs">Dashboard</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
