import Link from "next/link";

export const metadata = {
  title: "dashboard",
  description: "dashboard desc",
};

// 分仓需求提报
const View = () => {
  return (
    <>
      {/* <PageTitle>分仓需求提报</PageTitle> */}
      <div className="pageContent">
        welcome
        <Link href="/category">跳转路由</Link>
      </div>
    </>
  );
};
View.displayName = "dashboard";
export default View;
