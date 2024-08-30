import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "../api/auth/[...nextauth]/route";

type Props = {
  children: React.ReactNode;
};

const DashBoardLayout = async (props: Props) => {
  const session = await getServerSession(authOptions);
  console.log(session ? session.user : "no-session");
  console.log("Session user ID:", session?.user?.id);

  return (
    <div className="flex">
      <div className="min-h-[calc(100vh-88px)] w-80 border-r shadow p-2">
        <Link
          className="p-3 rounded hover:bg-emerald-600 hover:text-white hover:shadow transition "
          href={`/dashboard/user/${session?.user.id}`}
        >
          User Profile
        </Link>
      </div>
      <div className="w-full">{props.children}</div>
    </div>
  );
};

export default DashBoardLayout;
