import { StatusBar } from 'expo-status-bar';
import { Alert } from 'react-native';
import sdk, { Client, Account, ID, Models, Avatars, Databases, Query } from 'react-native-appwrite';

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
      ]
    )

    return posts.documents;
  }catch(err){
    console.log(err)
  }
}  

