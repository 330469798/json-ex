export function updateQueryStringParameter(url, key, value) {
    if (value == null) {
        return url;
    }
    const re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    const separator = url.indexOf("?") !== -1 ? "&" : "?";
    if (url.match(re)) {
        return url.replace(re, "$1" + key + "=" + value + "$2");
    } else {
        return url + separator + key + "=" + value;
    }
}

export function replaceParams(key, value) {
    const url = updateQueryStringParameter(location.href, key, value);
    window.history.replaceState(
        {
            path: url,
        },
        ``,
        url
    );
}