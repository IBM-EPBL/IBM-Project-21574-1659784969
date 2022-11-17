import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const createUser = async (name = "", email) => {
  if (!email) return false;

  try {
    await fetch(`${process.env.SERVER_URL}/createuser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email }),
    });
    return true;
  } catch (err) {
    console.log(err);
  }
  return false;
};

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      await createUser(user.name, user.email);
      return true;
    },
  },
};

export default NextAuth(authOptions);
