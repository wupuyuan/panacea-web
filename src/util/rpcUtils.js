export function getUrl(path, params) {
    if (params != null) {
        path = path + "?";
        for (let key in params) {
            path += key + "=" + params[key] + "&";
        }
    }
    let url = "http://127.0.0.1:8888" + path;
    console.log(url);
    return url;
}

export function get(path, params) {
    let url = getUrl(path, params);
    return fetch(url, {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    }).then(response => {
        return response.json()
    }).then(response => {
        if (response.code == 0) {
            // 成功
            console.log("response => ", response);
            return response.data;
        } else {
            throw response.info;
        }
    }).catch(err => {
        console.error(err);
    })
}

export function del(path, params) {
    let url = getUrl(path, params);
    return fetch(url, {
        method: "DELETE",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    }).then(response => {
        return response.json()
    }).then(response => {
        if (response.code == 0) {
            // 成功
            console.log("response => ", response);
            return response.data;
        } else {
            throw response.info;
        }
    }).catch(err => {
        console.error(err);
    })
}

export function put(path, params, body) {
    let url = getUrl(path);
    return fetch(url, {
        method: "PUT",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }).then(response => {
        return response.json()
    }).then(response => {
        if (response.code == 0) {
            // 成功
            console.log("response => ", response);
            return response.data;
        } else {
            throw response.info;
        }
    }).catch(err => {
        console.error(err);
    })
}


export function findAssetTemplateChildren(params) {
    return get("/asset/template/child/get", params);
}

export function detailAssetTemplate(params) {
    return get("/asset/template/get", params);
}

export function addAssetTemplate(params, body) {
    return put("/asset/template/add", params, body);
}

export function addAssetTemplateParameter(params, body) {
    return put("/asset/template/parameter/add", params, body);
}

export function deleteAssetTemplateParameter(params) {
    return del("/asset/template/parameter/delete", params);
}

export function findInstance(params) {
    return get("/asset/instance/list", params);
}

export function addInstance(params, body) {
    return put("/asset/instance/add", params, body);
}