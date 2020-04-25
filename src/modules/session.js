export default function(data) {
    var config = JSON.parse(open('../config.json'));
    for(var i in data) {
        if(data[i].params.headers["X-AllClear-SessionID"] !== undefined) {
            data[i].params.headers["X-AllClear-SessionID"] = config.SessionID;
        }
    }
    return data;
}