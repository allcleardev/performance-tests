import {group} from "k6";
import batch from "../modules/batch.js";

const landingPage = JSON.parse(open("../json/landing.json"));

export let options = { 
    vus: 100,
    duration: "60s"
};

export default function() {

  group("Landing Page", function() {
    batch(landingPage);
  });
}