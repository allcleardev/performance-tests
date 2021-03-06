import {check} from "k6";
import http from "k6/http";

export let options = { 
    vus: 100,
    duration: "60s"
};

export default function() {
    let response = http.get("https://app-staging.allclear.app/");
    
    //Printing error code and running checks
    if (response.error_code !== 0) {
        console.log(response.error_code);
    }

    check(response, {
        "2xx and 3xx status codes ": (r) => response.error_code === 0
    });
}