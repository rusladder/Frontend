const enJSON = require('../app/locales/en.json');
const ruJSON = require('../app/locales/ru-Ru.json');

function processObject(obj) {
    const set = new Set();

    inner(obj, '', set);

    return set;
}

function inner(obj, parentPath, set) {
    for (let key in obj) {
        const path = parentPath + '.' + key;
        const value = obj[key];

        if (typeof value === 'string') {
            set.add(path);
        } else {
            inner(value, path, set);
        }
    }
}
const enSet = processObject(enJSON);
const ruSet = processObject(ruJSON);

function diff(en, ru) {
    let isOk = true;

    for (let path of ru) {
        if (!en.has(path)) {
            isOk = false;
            console.log('Not found in en.json:', path.substr(1));
        }
    }

    if (isOk) {
        console.log('All keys have a place');
    }
}

diff(enSet, ruSet);
