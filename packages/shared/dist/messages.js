"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllMessages = exports.UpdateObjectMessage = exports.RemoveObjectMessage = exports.AddObjectMessage = exports.LeaveRoomMessage = exports.JoinRoomMessage = exports.MessageType = void 0;
var MessageType;
(function (MessageType) {
    MessageType["JoinRoom"] = "joinRoom";
    MessageType["LeaveRoom"] = "leaveRoom";
    MessageType["AddObject"] = "addObject";
    MessageType["RemoveObject"] = "removeObject";
    MessageType["UpdateObject"] = "updateObject";
})(MessageType || (exports.MessageType = MessageType = {}));
class JoinRoomMessage {
    type;
    roomId;
}
exports.JoinRoomMessage = JoinRoomMessage;
class LeaveRoomMessage {
    type;
    roomId;
}
exports.LeaveRoomMessage = LeaveRoomMessage;
class AddObjectMessage {
    type;
    roomId;
    object;
}
exports.AddObjectMessage = AddObjectMessage;
class RemoveObjectMessage {
    type;
    roomId;
    objectId;
}
exports.RemoveObjectMessage = RemoveObjectMessage;
class UpdateObjectMessage {
    type;
    roomId;
    object;
}
exports.UpdateObjectMessage = UpdateObjectMessage;
exports.AllMessages = [
    JoinRoomMessage,
    LeaveRoomMessage,
    AddObjectMessage,
    RemoveObjectMessage,
    UpdateObjectMessage
];
//# sourceMappingURL=messages.js.map