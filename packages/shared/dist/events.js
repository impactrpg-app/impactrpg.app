"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllEvents = exports.UpdateObjectEvent = exports.RemoveObjectEvent = exports.AddObjectEvent = exports.LeaveRoomEvent = exports.JoinRoomEvent = exports.EventType = void 0;
var EventType;
(function (EventType) {
    EventType["JoinRoom"] = "joinRoom";
    EventType["LeaveRoom"] = "leaveRoom";
    EventType["AddObject"] = "addObject";
    EventType["RemoveObject"] = "removeObject";
    EventType["UpdateObject"] = "updateObject";
})(EventType || (exports.EventType = EventType = {}));
class JoinRoomEvent {
}
exports.JoinRoomEvent = JoinRoomEvent;
class LeaveRoomEvent {
}
exports.LeaveRoomEvent = LeaveRoomEvent;
class AddObjectEvent {
}
exports.AddObjectEvent = AddObjectEvent;
class RemoveObjectEvent {
}
exports.RemoveObjectEvent = RemoveObjectEvent;
class UpdateObjectEvent {
}
exports.UpdateObjectEvent = UpdateObjectEvent;
exports.AllEvents = [JoinRoomEvent, LeaveRoomEvent, AddObjectEvent, RemoveObjectEvent, UpdateObjectEvent];
//# sourceMappingURL=events.js.map