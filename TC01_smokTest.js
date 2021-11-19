import http from "k6/http";
import { check } from "k6";

const baseUrl =
  "https://k6.io/docs/";

export const options = {
  vus: 100, //Smoke test with 100 virtual users
  duration: "5s",
};

export default function () {
  let res = http.get(`${baseUrl}`);
  // console.log("Response time was " + String(res.timings.duration) + " ms");
  check(res, {
    "is Smoke Test status code 200": (r) => r.status === 200,
    "response time OK": (r) => r.timings.duration < 3000,
  });
}

