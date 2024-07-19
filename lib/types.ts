export type VideosType = {
    $id?: string;
    title?: string;
    thumbnail?: any;
    prompt?: string;
    video?: any;
    creator? : UsersType
    liked? : UsersType[]; 
}

export type UsersType = {
    $id? : string;
    username?: string;
    email?: string;
    avatar?: any;
    accountId? : string; 
    bookmarked? : VideosType[];
}