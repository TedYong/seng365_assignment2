import create from 'zustand';
interface UserState {
    auction: auction[];
    setAuctions: (auctions: Array<auction>) => void;
    removeAuctions: (auction: auction) => void;
}
const useStore = create<UserState>((set) => ({
    auction: [],
    setAuctions: (newAuction: Array<auction>) => set(() => {
        return {auction: newAuction}
    }),
    removeAuctions: (user: auction) => set((state) => {
        return {auction: state.auction.filter(u => u.auctionId !==
                user.auctionId)}
    })
}))
export const useUserStore = useStore;