import {group} from "k6";
import batch from "../../modules/batch.js";

const landingPage = JSON.parse(open("../json/landing.json"));

export let options = { 
    vus: 1,
    //duration: "10s",
    iterations:1
};

export default function() {

  group("Landing Page", function() {
    batch(landingPage);
  });
}