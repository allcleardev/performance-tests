import {check} from "k6";
import http from "k6/http";

export let options = { 
    vus: 100,
    duration: "60s"
};

export default function() {
    let url = "https://app-staging.allclear.app/map";
    
    let params = {
        headers: {
            "Upgrade-Insecure-Requests": "1",
            "Sec-Fetch-User": "?1",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3"
        }
    }
    
    let response = http.get(url, params);
    
    //Printing error code and running checks
    if (response.error_code !== 0) {
        console.log(response.error_code);
    }

    check(response, {
        "2xx and 3xx status codes ": (r) => response.error_code === 0
    });
}