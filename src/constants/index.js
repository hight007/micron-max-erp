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

export const apiUrl = "http://localhost:2010/api/";
// export const apiUrl = "http://10.196.28.68:2010/api/";
export const secretKey = "C31e$t!c@";
export const apiName = {
  gecko: {
    tbWidgetVersion: "gecko/tbWidgetVersion",
    tbWidget: "gecko/tbWidget",
    tbFilterVersion: "gecko/tbFilterVersion",
    tbFilter: "gecko/tbFilter",
    tbDashboardVersion: "gecko/tbDashboardVersion",
    tbDashboard: "gecko/tbDashboard",
    tbDatasourceVersion: "gecko/tbDatasourceVersion",
    tbDatasource: "gecko/tbDatasource",
    tbGeckoItemNameList: "gecko/tbGeckoItemNameList",
    version: "gecko/version",
  },
  storeConnection: {
    connection: "storeConnection/connection",
  },
  storeProcedures: {
    versionList: "storeProcedures/versionList",
    query: "storeProcedures/query",
    query_updated: "storeProcedures/query_updated",
    storeProcedures: "storeProcedures/storeProcedures",
    storeProceduresUpdate: "storeProcedures/storeProceduresUpdate",
    updatedSpName: "storeProcedures/compareStoreProceduresWithLastVersion",
  },
  migration: {
    tbExternalConnections: "migration/tbExternalConnections",
    tbDatasource: "migration/tbDatasource",
  },
  analytics: {
    bu: "analytics/bu",
    eventLogRawData: "analytics/eventLogRawData",
    duration_analysis: "analytics/duration_analysis",
  },
  omise: {
    charge: "omise/charge",
  },
};

export const key = {
  token: "token",
  isLogined: "isLogined",
  loginTime: "loginTime",
};
