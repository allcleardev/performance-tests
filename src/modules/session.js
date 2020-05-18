export default function(data, id) {
    for(var i in data) {
        if(data[i].params.headers['X-AllClear-SessionID'] !== undefined) {
            data[i].params.headers['X-AllClear-SessionID'] = id;
        }
    }
    return data;
}