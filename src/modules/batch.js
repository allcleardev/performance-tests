import {check} from "k6";
import http from "k6/http";

export default function(requests) {
    let responses = http.batch(requests);
    for (var i in responses) {
        if (responses[i].error_code !== 0) {
            console.log(responses[i].error_code);
            console.log(responses[i].request.url);
        }
        check(responses[i], {
            "2xx and 3xx status codes ": (r) => responses[i].error_code === 0
        });
    }
}