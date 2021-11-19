import http from "k6/http";
import { check, group, sleep } from "k6";
import { Rate } from "k6/metrics";

const baseUrl = "https://k6.io";

let ErrorRate = new Rate("error_rate");

export const options = {
  vus: 200, //The options above defined what the ramp up and ramp down time is for 200 virtual users
  stages: [
    { duration: "30s", target: 100 }, // For the first 30 seconds, we'll ramp it up with 100 users.
    { duration: "1m", target: 100 }, // Then on the next minute, with another 100 users
    { duration: "30s", target: 0 }, // Then start to ramp down from 100 to 0 users after 30 seconds.
  ],
  thresholds: {
    error_metrics: [
      {
        threshold: "rate<0.1", // more than 10% of errors will abort the test
        abortOnFail: true,
        delayAbortEval: "10s",
      },
    ],
    http_req_duration: ["avg<600 || p(95)<3500"],
  },
};

export default function () {
  group("Load Test", function () {
    group("K6 docs endpoint", function () {
      const res = http.get(`${baseUrl}/docs`);
      check(res, {
        "is status code 200": (r) => r.status === 200,
      });
      if (!res) {
        ErrorRate.add(true);
      } else {
        ErrorRate.add(false);
      }
    });

    group("K6 pricing endpoint", function () {
      const res = http.get(`${baseUrl}/pricing`);
      check(res, {
        "is status code 200": (r) => r.status === 200,
      });
      if (!res) {
        ErrorRate.add(true);
      } else {
        ErrorRate.add(false);
      }
    });

    group("K6 cloud docs endpoint", function () {
      const res = http.get(`${baseUrl}/docs/cloud/`);
      check(res, {
        "is status code 200": (r) => r.status === 200,
        "response time OK": (r) => r.timings.duration < 4000,
      });
      if (!res) {
        ErrorRate.add(true);
      } else {
        ErrorRate.add(false);
      }
    });
    sleep(1);
  });
}
