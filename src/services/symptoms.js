import http from "k6/http";
import {Rate} from "k6/metrics";
import check from "../modules/check.js";

export let successfulRequests = new Rate('successful_requests');

//Assuming an average user session of 30 seconds
//Assuming 150 users equal 150 sessions
//The above means only one virtual user is needed to generate the load
export let options = { 
    vus: 1,
    duration: "10s",

    //Thresholds are set to check the max response time, 90th percentile response time, and success rate of the test
    //The test will abort if any of these fail which will let us know there has been a performance degradation
    thresholds: {
        "iteration_duration": [{
            threshold: "max<300",
            abortOnFail: true,
            delayAbortEval: "0s"
        }],
        "iteration_duration": [{
            threshold: "p(90)<50",
            abortOnFail: true,
            delayAbortEval: "0s"
        }],
        "successful_requests": [{
            threshold: "rate>0.99",
            abortOnFail: true,
            delayAbortEval: "0s"
        }]
    }
};

export default function() {
    let url = "https://api-staging.allclear.app/types/symptoms";

    let params = {
        headers: {
            "Accept": "application/json; charset=UTF-8",
        }
    };
    
    let response = http.get(url, null, params); 
    //Printing error code and running checks
    check(response, successfulRequests);
}