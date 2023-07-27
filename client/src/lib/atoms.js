import { atom } from 'recoil';

export const userAtom = atom({
    key: "userKey",
    default: null,
})

export const isMarketOpenAtom = atom ({
    key: "isMarketOpenKey",
    default: false,
})

export const tickerAtom = atom ({
    key: "tickerKey",
    default: "",
})

export const watchStocksArrayAtom = atom ({
    key: "watchedStockArrrayKey",
    default: [],
})

export const userStocksAtom = atom ({
    key: "userStocksKey",
    default: "",
})

export const newsArticlesAtom = atom ({
    key: "newsArticlesKey",
    default: [],
})