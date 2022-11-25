import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";

export default function DialogComponent() {
  const { data: session } = useSession();

  function removeHash() {
    history.pushState(
      "",
      document.title,
      window.location.pathname + window.location.search
    );
  }

  useEffect(() => {
    if (session) {
      removeHash();
    }
  }, [session]);

  return session ? null : (
    <div className="modal" id="login">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Like this news</h3>
        <p className="py-4">
          You can bookmark it to read it later. To get started login
        </p>
        <div className="modal-action">
          <a href="#" className="btn btn-outline">
            Cancel
          </a>
          <a href="#" onClick={() => signIn("google")} className="btn">
            Login
          </a>
        </div>
      </div>
    </div>
  );
}
