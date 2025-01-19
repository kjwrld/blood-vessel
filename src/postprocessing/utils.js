export function traverseVisibleMeshes(obj, callback) {
    if (obj.visible) {
        if (obj.isMesh || obj.isSkinnedMesh) {
            callback(obj);
        }

        const children = obj.children;
        for (let i = 0, l = children.length; i < l; i++) {
            traverseVisibleMeshes(children[i], callback);
        }
    }
}

export function shuffleArray(array, random = Math.random) {
    for (let i = array.length - 1; i > 0; i--) {
        const replaceIndex = ~~((random() - 1e-6) * i);
        const tmp = array[i];
        array[i] = array[replaceIndex];
        array[replaceIndex] = tmp;
    }
}

export function fillWithOnes(array, count) {
    array.fill(0);

    for (let i = 0; i < count; i++) {
        array[i] = 1;
    }
}
