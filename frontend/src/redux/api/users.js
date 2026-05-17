import { apiSlice } from "./apiSlice";
import { USERS_URL } from "../constants";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({ url: `${USERS_URL}/auth`, method: "POST", body: data }),
    }),
    register: builder.mutation({
      query: (data) => ({ url: `${USERS_URL}`, method: "POST", body: data }),
    }),
    logout: builder.mutation({
      query: () => ({ url: `${USERS_URL}/logout`, method: "POST" }),
    }),
    profile: builder.mutation({
      query: (data) => ({ url: `${USERS_URL}/profile`, method: "PUT", body: data }),
    }),
    getUsers: builder.query({
      query: () => ({ url: USERS_URL }),
    }),
    // Watchlist
    getWatchlist: builder.query({
      query: () => `${USERS_URL}/watchlist`,
      providesTags: ["Watchlist"],
    }),
    addToWatchlist: builder.mutation({
      query: (movieId) => ({ url: `${USERS_URL}/watchlist/${movieId}`, method: "POST" }),
      invalidatesTags: ["Watchlist"],
    }),
    removeFromWatchlist: builder.mutation({
      query: (movieId) => ({ url: `${USERS_URL}/watchlist/${movieId}`, method: "DELETE" }),
      invalidatesTags: ["Watchlist"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useProfileMutation,
  useGetUsersQuery,
  useGetWatchlistQuery,
  useAddToWatchlistMutation,
  useRemoveFromWatchlistMutation,
} = userApiSlice;
