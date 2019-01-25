let FOLDERS = /([^\/]+)/g;
let FOLDER = "[^\\/]";
let SPLIT = "(?:\\/){0,1}";
let RELATIVE = /(\/[^\/]+)\/(\.\.|\.)/;
let MEMO = {};

let PARAM = "*!";
let PARAM_OPTIONAL = "*?";
let PARAM_SPREAD = "...";

export function parse(string) {
    let folders = string.match(FOLDERS) || [""],
        regexp = new RegExp(
            "^" +
                folders
                    .map(folder => {
                        switch (folder) {
                            case PARAM:
                                return `\\/(${FOLDER}+)`;
                            case PARAM_OPTIONAL:
                                return `${SPLIT}(${FOLDER}*)`;
                            case PARAM_SPREAD:
                                return `(.*)`;
                            default:
                                return `\\/(?:${folder
                                    .replace(/\./g, "\\.")
                                    .replace(/\*/g, FOLDER + "+")
                                    .replace(/\((?!\?\:)/g, "(?:")})`;
                        }
                    })
                    .join("") +
                "$"
        );

    return regexp;
}

export function match(path, value) {
    if (!MEMO[path]) {
        MEMO[path] = parse(path);
    }
    path = MEMO[path];
    let vs = value.match(path);
    if (!vs) return;
    return vs.slice(1);
}

export function join(a = "", b = "") {
    return a.replace(/\/$/, "") + "/" + b.replace(/^\//, "");
}

function relative(string) {
    while (RELATIVE.test(string)) {
        string = string.replace(RELATIVE, (all, previus, dot) =>
            dot.length === 2 ? "" : previus
        );
    }
    return string || "/";
}

export function resolve(base, merge) {
    base = relative(base).match(FOLDERS) || [];
    merge = relative(merge).match(FOLDERS) || [];

    let folders = [""];

    for (let i = 0; i < merge.length; i++) {
        let esc;

        switch (base[i]) {
            case PARAM:
            case PARAM_OPTIONAL:
                folders.push(merge[i]);
                break;
            case PARAM_SPREAD:
                folders.push(...merge.slice(i));
                esc = true;
                break;
            default:
                folders.push(merge[i]);
        }
        if (esc) break;
    }
    return folders.join("/") || "/";
}
