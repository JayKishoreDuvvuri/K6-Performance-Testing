import http from "k6/http";
import { check, group, sleep } from "k6";

const baseUrl = "https://k6.io";

export let options = {
  stages: [
    { duration: "2m", target: 1000 }, // ramp up to 1000 users
    { duration: "1h56m", target: 1000 }, // stay at 1000 for ~2 hours
    { duration: "2m", target: 0 }, // scale down
  ],
};

export default function () {
  group("Soak Test", function () {
    group("K6 Docs endpoint", function () {
      const res = http.get(`${baseUrl}/docs`);
      check(res, {
        "is status code 200": (r) => r.status === 200,
      });
    });
    sleep(2);
  });
}
