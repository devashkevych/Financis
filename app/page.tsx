import Link from "next/link";
import Button from "@/components/Button";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center gap-8">
      <h2 className="border-b border-gray-600 w-3/4 text-center text-4xl font-bold pb-4 mt-4">
        Financis
      </h2>
      <div className="flex flex-col items-center">
        <h3 className="font-semibold text-3xl mt-32">Welcome</h3>
        <span className="text-gray-400">Track. Control. Financis.</span>
      </div>
      <div>
        <Link href="/auth/login">
          {" "}
          <Button title="Log In" type="button" />
        </Link>
        <Link href="/auth/signup">
          {" "}
          <Button title="Sign Up" type="button" />
        </Link>
      </div>
    </div>
  );
}
