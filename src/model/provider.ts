import DoorModel from './Door.model';
import ConfigModel from './Config.model';
import MessageModel from './Message.model';

const doorModel = new DoorModel('door');
const configModel = new ConfigModel('config');
const messageModel = new MessageModel('messages');

export { doorModel, configModel, messageModel };
