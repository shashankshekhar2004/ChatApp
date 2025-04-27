import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    selectedUser: null,
    
};

const userSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload;
           
           
           
        },
        removeSelectedUser:(state)=>{
            state.selectedUser=null
        }
      
    }
});

export const { setSelectedUser,removeSelectedUser} = userSlice.actions;
export default userSlice.reducer;