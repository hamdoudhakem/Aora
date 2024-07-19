import { VideosType, UsersType } from 'lib/types'
import sdk, {
  Client, 
  Account, 
  ID, 
  Models, 
  Avatars, 
  Databases, 
  Query, 
  Storage,
  ImageGravity,  
} from 'react-native-appwrite';

const appwriteConfig = {
  endpoint: 'https://cloud.appwrite.io/v1',
  projectId: '66788902003cafe0aeaa',
  platform: 'com.hamdoudhakem.aora',
  dbId: '66788e8c001fabeca500',
  userCollectionId: '66789753001dc884d388',
  videosCollectionId: '667897780009a5a1a5f1',
  storageId: '66789978001f812af96f',
}

const client = new Client();
client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform)   


const account = new Account(client);
const avatar = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client)
let session : Models.Session | null = null;

export async function login(email: string, password: string) {  
  session = await account.createEmailPasswordSession(email, password);  
}

export async function register(email: string, password: string, username: string) {
  
  const user = await account.create(
    ID.unique(), 
    email, 
    password, 
    username
  )    

  const avatarUrl = await avatar.getInitials()

  await login(email, password);  

  const newUser = await databases.createDocument(
    appwriteConfig.dbId,
    appwriteConfig.userCollectionId, 
    ID.unique(), 
    {
      accountId: user.$id,
      username,
      email,
      avatar: avatarUrl,
    }
  );
  
  return newUser;
  
}

export async function logout() {
  try{
    const session = await account.deleteSession('current');
    return session;
  }catch(error){
    console.error('an Error occured while logging out ',error);
    //throw new Error(error)
  } 
}

export async function getUser() {
  try{
    const currentAccount = await account.get();

    if(!currentAccount) throw Error

    const currentUser = await databases.listDocuments(
      appwriteConfig.dbId,
      appwriteConfig.userCollectionId,
      [
        Query.equal('accountId', currentAccount.$id)
      ]
    )

    if(!currentUser) throw Error

    return currentUser.documents[0];
  }catch(err){
    console.log(err)
  }
  
}

export async function getPosts() {
  try{
    const posts = await databases.listDocuments(
      appwriteConfig.dbId,
      appwriteConfig.videosCollectionId     
    )

    return posts.documents;
  }catch(err){
    console.log(err)
  }
}

export async function getLatestPosts() {
  try{
    const posts = await databases.listDocuments(
      appwriteConfig.dbId,
      appwriteConfig.videosCollectionId,
      [
        Query.orderDesc('$createdAt'),
        Query.limit(7)
      ]
    )

    return posts.documents;
  }catch(err){
    console.log(err)
  }
}  

export async function searchPosts(query : string) {
  try{
    const posts = await databases.listDocuments(
      appwriteConfig.dbId,
      appwriteConfig.videosCollectionId,
      [
        Query.search('title', query),         
      ]
    )

    return posts.documents;
  }catch(err){
    console.log(err)
  }
}  

export async function getUserPosts(userId : string) {
  try{
    const posts = await databases.listDocuments(
      appwriteConfig.dbId,
      appwriteConfig.videosCollectionId,
      [
        Query.equal('creator', userId), 
        Query.orderDesc('$createdAt'),        
      ]
    )

    return posts.documents;
  }catch(err){
    console.log(err)
  }
}  

export async function getFilePreview(fileId, fileType : string) {
  let fileUrl;

  try{
    if(fileType === 'video'){
      fileUrl = storage.getFileView(appwriteConfig.storageId, fileId);
    }else if (fileType === 'image'){
      fileUrl = storage.getFilePreview(
        appwriteConfig.storageId, 
        fileId, 2000, 2000, 
        ImageGravity.Top, 100
      );
    }else{
      throw new Error('Invalid file type')
    }

    if(!fileUrl) throw new Error('FileURL for either Image or Video is null')

    return fileUrl;
  }catch(err){
    throw new Error(err)
  }
}

export async function uploadFile(file, fileType : string) {
  if(!file){
    return;
  }

  const asset = {    
    name: file.fileName,
    type: file.mimeType,
    size: file.filesize,
    uri: file.uri
  }

  try{

    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      asset
    );

    const fileUrl = await getFilePreview(uploadedFile.$id, fileType)    

    return fileUrl;
  }catch(err){
    throw new Error(err)
  }
}

export async function createVideo(form : VideosType) {
  try{
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, 'image'),
      uploadFile(form.video, 'video')
    ])

    const newPost = await databases.createDocument(
      appwriteConfig.dbId,
      appwriteConfig.videosCollectionId,
      ID.unique(),
      {
        title: form.title,
        prompt: form.prompt,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        creator: form.creator.$id
      }
    )

    return newPost;
  }catch(err){
    throw new Error(err)
  }
}

export async function bookmarkVideo(video : Models.Document & VideosType) {
  try{
   
    const user : Models.Document & UsersType = await getUser()

    console.log('I Will start Adding it from the Bookmarked')

    const prevLikedIds = video.liked ? 
      video.liked.map(likedUser => likedUser.$id) : []; 

    const updatedVideo = await databases.updateDocument(
      appwriteConfig.dbId,
      appwriteConfig.videosCollectionId,
      video.$id,
      {
        liked: [...prevLikedIds, user.$id]
      }
    )

    const prevBookmarked = user.bookmarked ? 
      user.bookmarked.map(bookmarked => bookmarked.$id) : [];

    const updatedUser = await databases.updateDocument(
      appwriteConfig.dbId,
      appwriteConfig.userCollectionId,
      user.$id,
      {
        bookmarked: [...prevBookmarked, video.$id]
      }
    )

    console.log('I Added it from the Bookmarked')

    return updatedVideo
    
  }catch(err){
    throw new Error(err)
  }
}

export async function unBookmarkVideo(video : Models.Document & VideosType) {
  try{
    
    //Get the Latest data about the User
    const user : Models.Document & UsersType = await getUser()    

    //Get the Latest Data about the video or else the liked array will be empty
    const updatedVideo = await databases.listDocuments(
      appwriteConfig.dbId,
      appwriteConfig.videosCollectionId,
      [
        Query.equal('$id', video.$id)
      ]
    )

    console.log('I Will start deleting it from the Bookmarked')

    const filteredLiked : UsersType[] = updatedVideo.documents[0].liked.filter(likedUser => likedUser.$id !== user.$id);   

    const updatedLiked = await databases.updateDocument(
      appwriteConfig.dbId,
      appwriteConfig.videosCollectionId,
      video.$id,
      {
        liked: filteredLiked
      }
    )

    const filteredBookmarks : VideosType[] = user.bookmarked.filter(likedVideo => likedVideo.$id !== video.$id);

    const updatedBoormaks = await databases.updateDocument(
      appwriteConfig.dbId,
      appwriteConfig.userCollectionId,
      user.$id,
      {
        bookmarked: filteredBookmarks
      }
    )

    console.log('I deleted it from the Bookmarked')

    return updatedLiked
    
  }catch(err){
    throw new Error(err)
  }
}

export async function getUserBookmarkedVideos() {
  try{
    
    const user : Models.Document & UsersType = await getUser();  

    return [user] ;
    
  }catch(err){
    throw new Error(err)
  }
}

