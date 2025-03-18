"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllMessages = exports.UpdateObjectMessage = exports.RemoveObjectMessage = exports.AddObjectMessage = exports.LeaveRoomMessage = exports.JoinRoomMessage = exports.MessageType = void 0;
exports.MessageType = {
    JoinRoom: 'joinRoom',
    LeaveRoom: 'leaveRoom',
    AddObject: 'addObject',
    RemoveObject: 'removeObject',
    UpdateObject: 'updateObject',
};
class JoinRoomMessage {
}
exports.JoinRoomMessage = JoinRoomMessage;
class LeaveRoomMessage {
}
exports.LeaveRoomMessage = LeaveRoomMessage;
class AddObjectMessage {
}
exports.AddObjectMessage = AddObjectMessage;
class RemoveObjectMessage {
}
exports.RemoveObjectMessage = RemoveObjectMessage;
class UpdateObjectMessage {
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