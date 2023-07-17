import EventEmitter from "eventemitter3";

type EventTopics = "NOTIFICATION";

export const eventBus = new EventEmitter<EventTopics>();
