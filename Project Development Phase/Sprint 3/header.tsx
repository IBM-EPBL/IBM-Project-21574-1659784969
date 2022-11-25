import { signIn, signOut, useSession } from "next-auth/react";

const authHeader = () => {
  return (
    <ul
      tabIndex={0}
      className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
    >
      <li>
        <a className="justify-between">Bookmarks</a>
      </li>
      <li onClick={() => signOut()}>
        <a>Logout</a>
      </li>
    </ul>
  );
};

const normalHeader = () => {
  return (
    <ul
      tabIndex={0}
      className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
    >
      <li onClick={() => signIn("google")}>
        <a className="justify-between">Login</a>
      </li>
    </ul>
  );
};

export default function Header() {
  const { data: session } = useSession();
  return (
    <div className="hidden sm:flex navbar bg-transparent p-3">
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl text-white">News app</a>
      </div>
      <div className="flex-none">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              {session?.user?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={session?.user.image} alt="avatar" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 rounded-full"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
            </div>
          </label>

          {session ? authHeader() : normalHeader()}
        </div>
      </div>
    </div>
  );
}
