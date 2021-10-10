import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/index';

export default createStore(
  rootReducer,
  applyMiddleware(thunk)
);

// docker-compose-jenkins-ansible-mongo-nodejs-react-server