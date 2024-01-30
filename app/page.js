import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "home",
  description: "home desc",
};

const View = () => {
  return (
    <>
      <div className="pageContent">
        welcome home
        <br/>
        <Link href="/category">category</Link>
        <br/>
        <Link href="/about">about</Link>
      </div>
    </>
  );
};
View.displayName = "home";
export default View;

