import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "page",
  description: "page desc",
};

const View = () => {
  return (
    <>
      <div className="pageContent">
        欢迎
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

