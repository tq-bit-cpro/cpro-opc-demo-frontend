import HalleModel from './Halle.model';
import ConfigModel from './Config.model';
import MessageModel from './Message.model';

const halleModel = new HalleModel('halle');
const configModel = new ConfigModel('config');
const messageModel = new MessageModel('messages');

export { halleModel, configModel, messageModel };
