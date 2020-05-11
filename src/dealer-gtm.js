var currentVehicles = [];

function add(data) {
    currentVehicles.push(data);
}

function commit() {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        list_productidsall: currentVehicles,
    });

    currentVehicles = [];
}

module.exports = {
    add: add,
    commit: commit,
};
