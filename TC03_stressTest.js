import http from "k6/http";
import { check, group, sleep } from "k6";

const baseUrl =
  "https://k6.io";

export const options = {
  vus: 500, //The options above defined what the ramp up and ramp down time is for 500 virtual users
  stages: [
    { duration: "1m", target: 100 }, // below normal load
    { duration: "2m", target: 100 },
    { duration: "1m", target: 200 }, // normal load
    { duration: "2m", target: 200 },
    { duration: "1m", target: 300 }, // around the breaking point
    { duration: "2m", target: 300 },
    { duration: "1m", target: 400 }, // little above the breaking point
    { duration: "2m", target: 400 },
    { duration: "1m", target: 500 }, // above the breaking point
    { duration: "2m", target: 500 },
    { duration: "2m", target: 0 }, // scale down. Recovery stage.
  ],
};

export default function () {
  group("Stress Test", () => {
    let responses = http.batch([
      ["GET", `${baseUrl}/docs`],
      ["GET", `${baseUrl}/pricing`],
      ["GET", `${baseUrl}/docs/cloud`],
    ]);
    check(responses[0], {
      "response time OK for K6 Docs": (r) => r.timings.duration < 1500,
    });
    check(responses[1], {
      "response time OK for K6 Pricing": (r) => r.timings.duration < 1500,
    });
    check(responses[2], {
      "response time OK for K6 Cloud Docs": (r) => r.timings.duration < 1500,
    });
    sleep(2);
  });
}
