// import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// interface UserStatusState {
//   userStatus: string;
//   otherUsersStatus: Record<string, string>; // Map of user IDs to their statuses
// }

// const initialState: UserStatusState = {
//   userStatus: 'Offline',
//   otherUsersStatus: {},
// };

// const userStatusSlice = createSlice({
//   name: 'userStatus',
//   initialState,
//   reducers: {
//     setUserStatus: (state, action: PayloadAction<string>) => {
//       state.userStatus = action.payload;
//     },
//     setOtherUserStatus: (state, action: PayloadAction<{ userId: string; status: string }>) => {
//       state.otherUsersStatus[action.payload.userId] = action.payload.status;
//     },
//   },
// });

// export const { setUserStatus, setOtherUserStatus } = userStatusSlice.actions;
// export default userStatusSlice.reducer;
