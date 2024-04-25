import { useRouter } from "next/router";
import Image from "next/image";

// 动态路由
const Post = ({ id, data }) => {
  // const router = useRouter();
  // const { id } = router.query;

  // console.log(data);
  return (
    <div>
      <div>宝可梦编号：{id}</div>
      <div>宝可梦：{data.name}</div>
      <div>体重：{data.weight}</div>
      <div>高：{data.height}</div>
      {data.sprites.other["official-artwork"].front_default}
      <img
        alt="pic"
        src={data.sprites.other["official-artwork"].front_default}
        width={50}
        height={50}
      />
    </div>
  );
};

export default Post;

// 1.服务端渲染获取数据 getServerSideProps
// 是在每次请求时运行
// export async function getServerSideProps(context) {
//   const { id } = context.query;

//   const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(
//     (data) => data.json()
//   );

//   return {
//     props: {
//       id,
//       data: res,
//     },
//   };
// }

// 2.服务端生成 getStaticProps
// 搭配getStaticPaths使用
export async function getStaticProps(context) {
  const { id } = context.params;

  console.log(id);
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(
    (data) => data.json()
  );

  return {
    props: {
      id,
      data: res,
    },
  };
}

export async function getStaticPaths() {
  const element = [];
  for (let index = 0; index < 20; index++) {
    element.push(index);
  }
  return {
    paths: element.map((id) => ({ params: { id: id + "" } })),
    fallback: "blocking", // 超出1-20编号外的将启用服务端渲染
  };
}
