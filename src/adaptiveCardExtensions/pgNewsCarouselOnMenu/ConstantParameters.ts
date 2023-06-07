 export let parameters = {
 onLoadSitePageURL : "https://pgonedev.sharepoint.com/_api/Web/Lists/GetByTitle('Site Pages')/Items?$select=ID,FileRef,Title,PGLocation,NewsDescription,PGNewsImage,ExternalLink&$filter=PGLocation ne null&$orderby=Modified desc&$top=15",
 getSiteUserID : "https://pgonedev.sharepoint.com/_api/web/currentuser",
 CreateListItem : "https://pgonedev.sharepoint.com/_api/web/lists/GetByTitle('PromoteToGlobalRequestList')/items",
 OnloadGetListItem : "https://pgonedev.sharepoint.com/_api/Web/Lists/GetByTitle('PromoteToGlobalRequestList')/Items?$select=ID,Title,PageName,Requestor/EMail,PageURL,StatusOfRequestToGlobal&$expand=Requestor&$filter=StatusOfRequestToGlobal eq 'Requested'"


}