import Link from "next/link";

export const metadata = {
  title: "about",
  description: "about desc",
};

const View = () => {
  return (
    <>
      <div className="pageContent">about</div>
    </>
  );
};
View.displayName = "about";
export default View;
