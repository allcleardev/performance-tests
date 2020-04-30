import {group} from "k6";
import batch from "../modules/batch.js";
import session from "../modules/session.js";

const mapPage = session(JSON.parse(open("../json/map2.json")));

export let options = { 
    vus: 100,
    //duration: "60s",
    iterations: 600
};

export default function() {

  group("Map Page", function() {
    batch(mapPage);
  });
}