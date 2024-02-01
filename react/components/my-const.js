export const API_SERVER = 'http://localhost:3005'

export const CS_LIST = API_SERVER + '/course/api'

export const AB_LIST = API_SERVER + '/product/api'
export const AB_GET_ONE = API_SERVER + '/product'
export const AB_STOCK = API_SERVER + '/stock/api'


// 得到課程 單筆 資料
export const CS_DETAIL_ONE = API_SERVER + '/course' // method: GET
// 得到課程 3筆留言 資料
export const CS_COMMENT_THREE = API_SERVER + '/course/member-comment' // method: GET

// 刪除某一筆
// /address-book/:sid
export const CS_DEL_ONE = API_SERVER + '/course' // method: DELETE

/* 撈 分類 */
// 撈 分類1:縫紉
export const CS_CATE_ONE = API_SERVER + '/course/category1/api' // method: GET

/* 課程訂單 */
// 新增 課程訂單
export const CS_ORDER_ADD = API_SERVER + '/course/order-add' // method: POST
// 得到 最新一筆課程訂單 的單筆資料(結帳完成時)
export const CS_NEW_ORDER_ONE = API_SERVER + '/course/new-course-order/api' // method: GET
// 得到 我的課程訂單 的資料
export const CS_MY_ORDER = API_SERVER + '/course/my-course-order/api' // method: GET

/* 講師評價 */
// 新增 講師評價
export const TCH_EVA_ADD = API_SERVER + '/course/evaluation-add' // method: POST

/* 收藏 */
// 課程-收藏列表
export const CS_FAV = API_SERVER + '/course/get-course-fav' // method: GET
// 課程-加入收藏
export const CS_FAV_ADD = API_SERVER + '/course/add-course-fav' // method: POST
// 課程-移除收藏
export const CS_FAV_REMOVE = API_SERVER + '/course/delete-course-fav' // method: DELETE

// 撈 猜你可能喜歡 資料
export const CS_MAYBE_LIKE = API_SERVER + '/course/maybe-like/api' // method: GET

// 新增 課程
export const CS_ADD = API_SERVER + '/course/add' // method: POST

/*
// 取得某一筆
// http://localhost:3002/address-book/api/edit/977
export const AB_GET_ONE = API_SERVER + '/address-book/api/edit' // method: GET
//                                                   ^^^^^^^^^^^ 此路徑要跟後端node的一樣
// AB_GET_ONE + "/977"

// 修改某一筆
// /address-book/edit/:sid
export const AB_EDIT_ONE = API_SERVER + '/address-book/edit' // method: PUT



// ---------- 登入
export const LOGIN = API_SERVER + '/login-jwt' // method: POST, 欄位 email, password

// 會員路由
export const PROFILE = API_SERVER + '/profile' // method: GET, 取得用戶資料
*/

export const M_LIST = API_SERVER + '/member/api'
export const M_ADD = API_SERVER + '/member/add'
export const M_GET_ONE = API_SERVER + '/member/api/edit'
export const M_EDIT_ONE = API_SERVER + '/member/api/edit'
export const M_DEL_ONE = API_SERVER + '/member'

export const CITY_LIST = API_SERVER + '/city/api'
export const AREA_LIST = API_SERVER + '/city/area/api'

export const LOGIN = API_SERVER + '/login-jwt'
export const PROFILE = API_SERVER + '/member/profile'
//會員的收藏列表
export const COLLECTION = API_SERVER + '/member/collection'

export const S_LIST = API_SERVER + '/space/api'
export const S_LIST_PHOTO = API_SERVER + '/space/api/photo'
export const P_LIST_PHOTO = API_SERVER + '/space/api/place'
export const S_ADD = API_SERVER + '/space/add'
export const S_ORDER_ADD = API_SERVER + '/space/order'
export const S_GET_ORDER = API_SERVER + '/space/order/api'
export const S_GET_ORDER_ONE = API_SERVER + '/space/order/one'

export const S_GET_ONE = API_SERVER + '/space/api/detail'
export const S_EDIT_ONE = API_SERVER + '/space/edit'
export const S_DEL_ONE = API_SERVER + '/space'

export const D_LIST = API_SERVER + '/device/api'
export const D_ADD = API_SERVER + '/device/add'
export const D_GET_ONE = API_SERVER + '/device/api/edit'
export const D_EDIT_ONE = API_SERVER + '/device/edit'
export const D_DEL_ONE = API_SERVER + '/device'

export const EX_LIST = API_SERVER + '/exhibition/api'
export const EX_FALL = API_SERVER + '/exhibition/api/fall'
export const EX_ADD = API_SERVER + '/exhibition/cf/api/post'
export const EX_GET_ONE = API_SERVER + '/exhibition/cf/api'
//加入收藏
export const BLOG_FAV_ADD = API_SERVER + '/cfCollect/api/add-blog-fav' // post
//移除收藏
export const BLOG_FAV_REMOVE = API_SERVER + '/cfCollect/api/delete-blog-fav' // delete
//收藏列表
export const BLOG_FAV = API_SERVER + '/cfCollect/api/get-blog-fav' // get

// export const EX_ADD = API_SERVER + '/exhibition/add' // method: POST

// // 取得某一筆
// // http://localhost:3005/address-book/api/edit/977
// export const EX_GET_ONE = API_SERVER + '/exhibition/api/edit' // method: GET
// // AB_GET_ONE + "/977"

// // 修改某一筆
// // /address-book/edit/:sid
// export const EX_EDIT_ONE = API_SERVER + '/exhibition/edit' // method: PUT

// // 刪除某一筆
// // /address-book/:sid
// export const EX_DEL_ONE = API_SERVER + '/exhibition' // method: DELETE
