var currentVehicles = [];

function add(data) {
    currentVehicles.push(data);
}

function commit() {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        list_productidsall: currentVehicles
    });

    currentVehicles.length = 0;
}

module.exports = {
    add: add,
    commit: commit
};
