/**
 * Participant States
 */
var ParticipantState = function() {
    this.state = "join";
    this.possibleStates = ["join", "wait", "started"];

    this.to = function(newState) {
        if(!_.contains(this.possibleStates, newState)) {
            throw "Invalid state: " + newState;
        } else {
            this.state = newState;
        }
    }
};