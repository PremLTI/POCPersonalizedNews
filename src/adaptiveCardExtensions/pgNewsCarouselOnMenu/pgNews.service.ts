import { AdaptiveCardExtensionContext } from '@microsoft/sp-adaptive-card-extension-base';
import { SPHttpClient } from '@microsoft/sp-http';
import './ConstantParameters';
import { parameters } from './ConstantParameters';

// Interface for Site page properties. 
export interface IListItem {
  id: string;
  title: string;
  pgLocation: string;
  pgLink: any;
  pgQuickLink: any;
  pgCarouselImage:any;
  newsDescription: any;
  index: number;
  isRequested: boolean;
}

// Interface for List item properties

export interface IPromoteReqListItem {
  id: string;
  promotetitle: string;
  promotePageName: string;
  promotePageID: any;
  promoteRequestor:any;
  promotePageURL: any;
  promoteStatusOfRequestToGlobal:any;
  index: number;
}

// oninit call to get site page library items based on Filter: PGLocation not equal to null
// order by: Modified by Desc and Top: 15 

export const fetchSitePageLibrary = async (spContext: AdaptiveCardExtensionContext): Promise<IListItem[]> => {
    try { 
  if (!spContext) { return Promise.reject('No spContext.'); }
 
  const response = await (await spContext.spHttpClient.get(
    parameters.onLoadSitePageURL,
    SPHttpClient.configurations.v1
  )).json();

  if (response.value?.length > 0) {
    return Promise.resolve(response.value.map(
      (listItem: any, index: number) => {
        return <IListItem>{
          id: listItem.ID,  
          title: listItem.Title,
          pgLocation: listItem.PGLocation,
          pgLink: spContext.pageContext.site.absoluteUrl+listItem.FileRef,
          pgQuickLink :  listItem.ExternalLink ? listItem.ExternalLink.Url : null,
          pgCarouselImage: listItem.PGNewsImage.Url,
          newsDescription : listItem.NewsDescription,
          index: index,
          isRequested: false
        };
    }
    ));
  } else {
    return Promise.resolve([]);
  }
} 
catch (error) {  
  console.log("Error in fetch Site Page Library : " + error);  
} 

}

// get user id to push the info into person or group field. 
const getSiteUserId=async(spContext:AdaptiveCardExtensionContext): Promise<any[]>=>{

  try {  
    
     let userid= await (await spContext.spHttpClient.get( parameters.getSiteUserID,SPHttpClient.configurations.v1)).json();  
      return   userid.Id;    
    } 
    catch (error) {  
      console.log("Error in spLoggedInUserDetails : " + error);  
    } 
  
  }
// create item to list, when the request made from end user for promote to global.
export const CreateItemToList=async (spContext: AdaptiveCardExtensionContext , data :any)=>{
  try {  

   let getuserid :any[] = await getSiteUserId(spContext);
  const body: string = JSON.stringify({ 
      'PageName':data.title , 'Title':data.id.toString(), 'RequestorId':getuserid,
      'PageURL':{
        'Description': data.pageURL,
        'Url': data.pageURL
    },
    'StatusOfRequestToGlobal':"Requested"
    });
    await  spContext.spHttpClient.post(parameters.CreateListItem,
      SPHttpClient.configurations.v1, {
      headers: {
        'Accept': 'application/json; odata.metadata=none',
        'Content-type': 'application/json'
      },
      body: body
    })

  } 

  catch (error) {  
    console.log("Error in CreateItemToList : " + error);  
  } 

  }


// onload call to fetch details of promotetoglboallist items, when the status equal to Requested. 
  export const promoteFetchListItem = async (spContext: AdaptiveCardExtensionContext): Promise<IListItem[]> => {
    try {  
    if (!spContext) { return Promise.reject('No spContext.'); }
  
    const response = await (await spContext.spHttpClient.get(
      parameters.OnloadGetListItem,
      SPHttpClient.configurations.v1
    )).json();
  
    if (response.value?.length > 0) {
      return Promise.resolve(response.value.map(
        (listItem: any, index: number) => {
          return <IPromoteReqListItem>{
            id: listItem.ID,
            promotePageName: listItem.PageName,
            promotePageID: listItem.Title,
            promoteRequestor: listItem.Requestor,
            promotePageURL : listItem.PageURL,
            promoteStatusOfRequestToGlobal: listItem.StatusOfRequestToGlobal,
            index: index
          };
        }
      ));
    } else {
      return Promise.resolve([]);
    }

  } 
  catch (error) {  
    console.log("Error in promoteFetchListItem : " + error);  
  }

  }
