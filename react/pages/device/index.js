import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { D_DEL_ONE, D_LIST } from "@/components/my-const";
import dayjs from "dayjs";
import { useRouter } from "next/router";


export default function DIndex() {
  const [data, setData] = useState({});
  const router = useRouter();

  const getListData = async () => {
    console.log("router.query:", router.query);
    let page = +router.query.page || 1;
    if (page < 1) page = 1;
    try {
      const r = await fetch(D_LIST + `?page=${page}`);
      const d = await r.json();

      setData(d);
    } catch (ex) {}
  };

  useEffect(() => {
    getListData();
  }, [router.query.page]);

  const removeItemAndReload = async(device_id) => {
    console.log({ device_id });

    const r = await fetch(D_DEL_ONE + "/" + device_id, {
      method: "DELETE",
    })
    const result = await r.json();
    if (result.success) {
      // alert("完成刪除")
      // router.reload();
      getListData()
    }
  };

  return (
    <>
      <div>
        <div className="row">
          <div className="col">
            <nav aria-label="Page navigation example">
              <ul className="pagination">
                {data.success && data.totalPages
                  ? Array(11)
                      .fill(1)
                      .map((v, i) => {
                        const p = data.page - 5 + i;
                        if (p < 1 || p > data.totalPages) return null;
                        return (
                          <li
                            key={i}
                            className={
                              p === data.page ? "page-item active" : "page-item"
                            }
                          >
                            <Link className="page-link" href={"?page=" + p}>
                              {p}
                            </Link>
                          </li>
                        );
                      })
                  : null}
              </ul>
            </nav>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <table className={"table table-striped table-bordered "}>
              <thead>
                <tr>
                  <th>
                    <i className="fa-solid fa-trash"></i>
                  </th>
                  <th>編號</th>
                  <th>名稱</th>
                  <th>型號</th>
                  <th>介紹</th>
                  <th>日期</th>
                  <th>基本費</th>
                  <th>
                    <i className="fa-solid fa-square-pen"></i>
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.rows &&
                  data.rows.map((v, i) => {
                    return (
                      <tr key={v.device_id}>
                        <td>
                          <div>
                            <i className="fa-solid fa-trash"></i>
                          </div>
                        </td>
                        <td>{v.device_id}</td>
                        <td>{v.device_name}</td>
                        <td>{v.model}</td>
                        <td>{v.device_intro}</td>
                        <td>{dayjs(v.purchase_date).format("YYYY-MM-DD")}</td>
                        <td>{v.basic_fee}</td>

                        <td>
                          <Link href={`/device/edit/${v.device_id}`}>
                            <i className="fa-solid fa-square-pen"></i>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
