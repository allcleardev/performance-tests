import http from "k6/http";
import{sleep}from "k6";
import {Rate} from "k6/metrics";
import check from "../modules/check.js";

const config = JSON.parse(open('../config.json'));
const phone = config.E2EPhoneNumber;
const account = config.TwilioSID;
const basicAuth = config.TwilioBasicAuth;

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
            threshold: "max<1500",
            abortOnFail: true,
            delayAbortEval: "0s"
        }],
        "iteration_duration": [{
            threshold: "p(90)<1200",
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

function login(token) {
    let url = "https://api-staging.allclear.app/peoples/auth";
    let body = `{"phone":"${phone}","token":"${token}"}`;
    let params = {
        headers: {
          "Content-Type": "application/json;charset=UTF-8"
        }
    };
    let response = http.put(url, body, params);
    check(response, successfulRequests);
    return response.json(["id"]);
}

function logout(session) {
    let response = http.del("https://api-staging.allclear.app/sessions", null, {
      headers: {
        "X-AllClear-SessionID": session
      }
    });
    console.log(session);
    check(response, successfulRequests);
}

function verify() {
    let url = "https://api-staging.allclear.app/peoples/auth";
    let body = `{"phone": "${phone}"}`;
    let params = {
        headers: {
          "Content-Type": "application/json;charset=UTF-8"
        }
    };
    http.post(url, body, params);
}

function getCode(){
    let url = `https://api.twilio.com/2010-04-01/Accounts/${account}/Messages.json?To=${phone}&PageSize=20`;
    let params = {
        headers: {
            "Authorization": basicAuth
        }
    };
    let response = http.get(url, params);
    let body = response.json(["messages"])[0].body;
    let token = body.match(/[0-9]{6}/g);
    return token[0];
}

export default function() {
    verify();
    let token = getCode();
    let session = login(token);
    logout(session);
}