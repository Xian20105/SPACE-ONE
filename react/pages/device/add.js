import { Layout1 } from "@/components/Layout1";
import { useState } from "react";
import { z } from "zod";
import { D_ADD } from "@/components/my-const";

export default function DAdd() {
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

  const [displayInfo, setDisplayInfo] = useState(""); // "", "succ", "fail"
  const changeHandler = (e) => {
    const { name, id, value } = e.target;
    console.log({ name, id, value });
    setDisplayInfo("");
    setMyForm({ ...myForm, [id]: value });

    /*
    setMyForm((old) => {
      return { ...old, [id]: e.target.value };
    });
    */
  };
  console.log(myForm);
  const onSubmit = async (e) => {
    e.preventDefault();

    // TODO: 檢查各個欄位的資料
    // coerce 寬鬆的檢查方式
    // const emailSchema = z.coerce
    //   .string()
    //   .email({ message: "錯誤的 email 格式" });
    // console.log("emailSchema:", emailSchema.safeParse(myForm.email));

    const r = await fetch(D_ADD, {
      method: "POST",
      body: JSON.stringify(myForm),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseData = await r.json();
    if (responseData.success) {
      setDisplayInfo("succ");
    } else {
      setDisplayInfo("fail");
    }
  };

  return (
    <>
      <Layout1>
        <div className="row">
          <div className="col-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">新增資料</h5>
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
                        資料新增成功
                      </div>
                    ) : (
                      <div className="alert alert-danger" role="alert">
                        新增發生錯誤!!!
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