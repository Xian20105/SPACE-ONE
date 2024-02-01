import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { D_GET_ONE, D_EDIT_ONE } from "@/components/my-const";
import { Layout1 } from "@/components/Layout1";

export default function DEdit() {
  const [myForm, setMyForm] = useState({
    device_id: "",
    device_name: "",
    model: "",
    device_intro: "",
    purchase_date: "",
    basic_fee: "",
    time_rate: "",
    day_rate: "",
  });
  const router = useRouter();

  useEffect(() => {
    const device_id = +router.query.device_id;
    console.log({ device_id, raw: router.query.device_id });
    if (router.query.device_id !== undefined) {
      if (!device_id) {
        router.push("/device");
      } else {
        fetch(D_GET_ONE + "/" + device_id)
          .then((r) => r.json())
          .then((data) => {
            if (!data.success) {
              router.push("/device"); // 沒拿到資料, 跳到列表頁
            } else {
              setMyForm({ ...data.row });
            }
          })
          .catch((ex) => console.log(ex));
      }
    }
  }, [router.query.device_id]);
  const [displayInfo, setDisplayInfo] = useState(""); // "", "succ", "fail"

  const changeHandler = (e) => {
    const { name, id, value } = e.target;
    console.log({ name, id, value });
    setDisplayInfo("");
    setMyForm({ ...myForm, [id]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const mySend = {...myForm};
    // delete mySend.created_at;

    const r = await fetch(D_EDIT_ONE + "/" + myForm.device_id, {
      method: "PUT",
      body: JSON.stringify(mySend),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseData = await r.json();
    if (responseData.success) {
      setDisplayInfo("succ");
      // alert("新增成功");
    } else {
      setDisplayInfo("fail");
      // alert("新增發生錯誤!!!");
    }
  };
  return (
    <>
      <Layout1>
        <div className="row">
          <div className="col-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">編輯資料</h5>
                <form name="form1" onSubmit={onSubmit}>
                <div className="mb-3">
                    <label htmlFor="device_id" className="form-label">
                      編號
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="device_id"
                      name="device_id"
                      value={myForm.device_id}
                      onChange={changeHandler}
                    />
                    <div className="form-text"></div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="device_name" className="form-label">
                      名稱
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="device_name"
                      name="device_name"
                      value={myForm.device_name}
                      onChange={changeHandler}
                    />
                    <div className="form-text"></div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="model" className="form-label">
                      型號
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="model"
                      name="model"
                      value={myForm.model}
                      onChange={changeHandler}
                    />
                    <div className="form-text"></div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="device_intro" className="form-label">
                    設備介紹
                    </label>
                    <textarea
                      className="form-control"
                      id="device_intro"
                      name="device_intro"
                      cols="30"
                      rows="3"
                      value={myForm.device_intro}
                      onChange={changeHandler}
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="purchase_date" className="form-label">
                      採購日期
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="purchase_date"
                      name="purchase_date"
                      value={myForm.purchase_date}
                      onChange={changeHandler}
                    />
                    <div className="form-text"></div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="basic_fee" className="form-label">
                      基本費
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="basic_fee"
                      name="basic_fee"
                      value={myForm.basic_fee}
                      onChange={changeHandler}
                    />
                    <div className="form-text"></div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="time_rate" className="form-label">
                      時租
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="time_rate"
                      name="time_rate"
                      value={myForm.time_rate}
                      onChange={changeHandler}
                    />
                    <div className="form-text"></div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="day_rate" className="form-label">
                      日租
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="day_rate"
                      name="day_rate"
                      value={myForm.day_rate}
                      onChange={changeHandler}
                    />
                    <div className="form-text"></div>
                  </div>
                  {displayInfo ? (
                    displayInfo === "succ" ? (
                      <div className="alert alert-success" role="alert">
                        資料修改成功
                      </div>
                    ) : (
                      <div className="alert alert-danger" role="alert">
                        資料沒有修改!!!
                      </div>
                    )
                  ) : null}
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Layout1>
    </>
  );
}
