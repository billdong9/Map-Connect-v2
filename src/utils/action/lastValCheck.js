import actionList from "./../../var/actionList";

const lastValues = {};
for (let i in actionList) {
    lastValues[i] = null;
}

export default (actionID, val) => {
    if (actionList[actionID][1] === 0) {
        // axes
        if (lastValues[actionID] !== val) {
            lastValues[actionID] = val;
            return true;
        }
    } else {
        // button
        if (lastValues[actionID] !== val) {
            lastValues[actionID] = val;
            if (val || actionID === 'reversethrust') {
                return true;
            }
        }
    }
    return false;
}