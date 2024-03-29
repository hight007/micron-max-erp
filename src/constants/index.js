// Error Code
export const E_PICKER_CANCELLED = "E_PICKER_CANCELLED";
export const E_PICKER_CANNOT_RUN_CAMERA_ON_SIMULATOR =
  "E_PICKER_CANNOT_RUN_CAMERA_ON_SIMULATOR";
export const E_PERMISSION_MISSING = "E_PERMISSION_MISSING";
export const E_PICKER_NO_CAMERA_PERMISSION = "E_PICKER_NO_CAMERA_PERMISSION";
export const E_USER_CANCELLED = "E_USER_CANCELLED";
export const E_UNKNOWN = "E_UNKNOWN";
export const E_DEVELOPER_ERROR = "E_DEVELOPER_ERROR";
export const TIMEOUT_NETWORK = "ECONNABORTED"; // request service timeout
export const NOT_CONNECT_NETWORK = "NOT_CONNECT_NETWORK";

//////////////// Localization Begin ////////////////
export const NETWORK_CONNECTION_MESSAGE =
  "Cannot connect to server, Please try again.";
export const NETWORK_TIMEOUT_MESSAGE =
  "A network timeout has occurred, Please try again.";
export const UPLOAD_PHOTO_FAIL_MESSAGE =
  "An error has occurred. The photo was unable to upload.";

export const YES = "YES";
export const NO = "NO";
export const OK = "ok";
export const NOK = "nok";

// export const apiUrl = "http://localhost:2008/api/MicronMax/";
export const apiUrl = "https://asia-southeast1-micronmax.cloudfunctions.net/micronmax2/api/MicronMax/";

export const apiName = {
  authen: {
    login: "authen/login/",
  },
  user: {
    register: "user/register/",
    allUsers: "user/allUsers/",
  },
  purchaseOrder:
  {
    po: 'purchaseOrder/po/',
    detail: 'purchaseOrder/detail/',
    get: 'purchaseOrder/get/',
    get2: 'purchaseOrder/get2/',
    listPo: 'purchaseOrder/listPo/',
    jobTracking: 'purchaseOrder/jobTracking/',
    generatePoDetailNumber: 'purchaseOrder/generatePoDetailNumber/',
    poName: 'purchaseOrder/poName/',
  },
  do: {
    deliveryOrder: 'do/deliveryOrder/',
    deliveryOrderDetail: 'do/deliveryOrderDetail/',
    report: 'do/report/',
    find: 'do/find/',
  },
  master: {
    customer: 'master/customer/',
  }
};

export const key = {
  user_id: "user_id",
  username: "username",
  user_level: "user_level",
  token: "token",
  isLogined: "isLogined",
  loginTime: "loginTime",

};
