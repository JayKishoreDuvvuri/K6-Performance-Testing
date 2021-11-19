import http from "k6/http";
import { check, group, sleep } from "k6";

const baseUrl =
  "https://k6.io";

export let options = {
  stages: [
    { duration: "10s", target: 100 }, // below normal load
    { duration: "1m", target: 100 },
    { duration: "10s", target: 15000 }, // spike to 15000 Users
    { duration: "2m", target: 15000 }, // Stay at 15000 users for 2 minutes
    { duration: "10s", target: 100 }, // Scale down. Recovery stage
    { duration: "1m", target: 100 },
    { duration: "10s", target: 0 },
  ],
};

export default function () {
  group("Spike Test", function () {
    group("K6 Docs endpoint", function () {
      const res = http.get(`${baseUrl}/docs`);
      check(res, {
        "is status code 200": (r) => r.status === 200,
        "response time OK": (r) => r.timings.duration < 2000,
      });
    });
    sleep(2);
  });
}
