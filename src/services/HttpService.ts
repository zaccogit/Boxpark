import Axios from "axios";
import { AxiosError, AxiosResponse } from "axios";
type Methods = "get" | "post" | "put" | "delete";

const CreateResponse = (
  method: Methods,
  host: string,
  url: string,
  req?: any,
  headers?: any,
  setLoader?: (e: boolean) => void
) => {
  return new Promise<any>((resolve, reject) => {
    if (setLoader) {
      setLoader(true);
    }

    let response;
    if (method === "get") {
      console.log(headers, "aqui 1");
      console.log(req, "aqui 2");
      console.log(`${host}${url}`, "aqui 3");
      response = Axios[method](`${host}${url}`.replaceAll(" ",""), { headers });
    } else {
      response = Axios[method](`${host}${url}`.replaceAll(" ",""), req, {
        headers,
        timeout: 6000,
      });
    }
    response.then((res: AxiosResponse) => {
      setTimeout(() => {
        if (setLoader) {
          setLoader(false);
        }
        resolve(res.data);
      }, 100);
    });
    response.catch((err: AxiosError) => {
      setTimeout(() => {
        if (setLoader) {
          setLoader(false);
        }
        reject(err);
      }, 100);
    });
  });
};

export default CreateResponse;
