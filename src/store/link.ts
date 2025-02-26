import {create} from 'zustand';

type LinkState = {
    link: string|null;
}

type LinkAction = {
    updateLink: (link: string) => void;
}

const useLinkStore = create<LinkState & LinkAction>((set) => ({
    link: '/', // 초기 페이지?
    updateLink: (new_link) => {
        set({link: new_link});
    }
}));

export {
    useLinkStore
};