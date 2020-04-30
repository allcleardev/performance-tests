import {check} from "k6";

export default function(response, threshold) {
    if (response.error_code !== 0) {
        console.log(response.error_code);
        console.log(response.request.url);
    }
    const result = check(response, {
        "2xx and 3xx status codes ": (r) => response.error_code === 0
    });
    threshold.add(result);
}