export type VideosType = {    
    title?: string;
    thumbnail?: any;
    prompt?: string;
    video?: any;
    creator? : {
        username?: string;
        avatar?: any;
    }    
}

export type UsersType = {    
    username?: string;
    email?: string;
    avatar?: any;
    accountId? : string; 
}