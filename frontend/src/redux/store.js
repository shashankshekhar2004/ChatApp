import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 
import { combineReducers } from 'redux';
import userReducer from './features/userSlice';


const persistConfig = {
  key: 'root', 
  storage,    
};


const rootReducer = combineReducers({
  auth: authReducer,
  user:userReducer

});


const persistedReducer = persistReducer(persistConfig, rootReducer);


export const store = configureStore({
  reducer: persistedReducer,
});


export const persistor = persistStore(store);