export class ApiResponse {
  statusCode: number;
  message: String;
  data: Object;

  constructor(statusCode = 200, message = "Sucess", data?: Object) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data || {};
  }
}
