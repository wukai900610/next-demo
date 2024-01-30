"use client";
import React, {
  memo,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useImperativeHandle,
} from "react";

import Loading from "@/app/components/loading";

// 分仓需求提报
const View = memo(() => {
  const [state, setState] = useState({
    data: [],
    loading: false,
  });

  const getQuestionList = () => {
    state.loading = true;
    setState({
      ...state,
    });
    fetch("/api/query")
      .then((res) => res.json())
      .then((res) => {
        if (res) {
          state.data = res;
          state.loading = false;
          setState({
            ...state,
          });
          console.log(res);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const init = () => {
    fetch("/api/system/session/getCurrentSession")
      .then((res) => {
        if (res) {
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    init();
    getQuestionList();
  }, []);

  return (
    <>
      <a>{state.data.length}</a>
      {state.loading ? (
        <Loading />
      ) : (
        <ul>
          {state.data.map((item, index) => {
            return (
              <li key={item.id}>{item.properties.Name.title[0].plain_text}</li>
            );
          })}
        </ul>
      )}
    </>
  );
});
View.displayName = "category";
export default View;
