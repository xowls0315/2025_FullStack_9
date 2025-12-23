"use client";

import { supabase } from "@/supabase";
import axios from "axios";
import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);

  // const click = async () => {
  //   const bucket = supabase.storage.from("photo");
  //   const { data, error } = await bucket.list("", {
  //     limit: 1000,
  //     offset: 0,
  //     sortBy: { column: "name", order: "asc" },
  //   });
  //   console.log("error: ", error);
  //   console.log("files: ", data);
  //   const name = (data ?? []).map((f) => f.name);
  //   console.log({ data });
  //   console.log({ name });
  // };

  // const send = async () => {
  //   // supabase에 올리기
  //   if (!file) {
  //     alert("사진을 올려주세요.");
  //     return;
  //   }
  //   const bucket = supabase.storage.from("photo");
  //   const tempFilePath = `temp/${crypto.randomUUID()}`;
  //   const { data, error } = await bucket.upload(tempFilePath, file);
  //   if (error) {
  //     alert("업로드 실패");
  //     return;
  //   }
  //   console.log("업로드 성공!");
  //   console.log({ data });
  // };

  const send = async () => {
    if (!file) return alert("사진 없음");

    const form = new FormData();

    form.append("file", file);

    const res = await axios.post("http://localhost:3001/upload", form);
    console.log(res.data);
  };

  return (
    <main style={{ padding: 24, display: "flex", flexDirection: "column", width: "fit-content" }}>
      {/* <button onClick={click} style={{ padding: "5px 10px", borderRadius: "10px", backgroundColor: "skyblue", cursor: "pointer", transition: "all 0.5s" }}>
        버튼!!
      </button> */}
      <input onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} type="file" />
      {/* 사진이 있으면 조회, 없으면 첨부해서 올리고 supabase로 전송? */}
      <button onClick={send} style={{ padding: "5px 10px", borderRadius: "10px", backgroundColor: "skyblue", cursor: "pointer", transition: "all 0.5s" }}>
        사진 전송
      </button>
    </main>
  );
}
