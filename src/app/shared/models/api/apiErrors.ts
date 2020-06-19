import { CustomError } from "./custom-error";

export interface ApiErrors {
  [action: string]: CustomError;
}
