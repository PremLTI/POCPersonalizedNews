import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { QuickView } from './quickView/QuickView';
import { PgNewsCarouselOnMenuPropertyPane } from './PgNewsCarouselOnMenuPropertyPane';
import './customStyle.scss';
import {
  IListItem,
  fetchSitePageLibrary,
  promoteFetchListItem,
  IPromoteReqListItem
} from './pgNews.service'

export interface IPgNewsCarouselOnMenuAdaptiveCardExtensionProps {
  title: string;
}
// state variable initialized
export interface IPgNewsCarouselOnMenuAdaptiveCardExtensionState {
  currentIndex: number;
  PGnewsCarousel: IListItem[];
  PGnewsCarouselFirstIndexView: IListItem[];
  PGnewsCarouselRestAllIndexView: IListItem[];
  PromoteFetchListItem: any;
}

const CARD_VIEW_REGISTRY_ID: string = 'PgNewsCarouselOnMenu_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID: string = 'PgNewsCarouselOnMenu_QUICK_VIEW';

export default class PgNewsCarouselOnMenuAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  IPgNewsCarouselOnMenuAdaptiveCardExtensionProps,
  IPgNewsCarouselOnMenuAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: PgNewsCarouselOnMenuPropertyPane | undefined;

  private pgNewsFirstIndex: IListItem[];
  private pgRestAllIndex: IListItem[];

  // Oninit method to start page life cycle. 

  public async onInit(): Promise<void> {
    // state variable declared
    this.state = {
      currentIndex: 0,
      PGnewsCarousel: [],
      PGnewsCarouselFirstIndexView: [],
      PGnewsCarouselRestAllIndexView: [],
      PromoteFetchListItem: []
    };

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

    try {

      if (this.properties.title != null) {
        // fetch site page details 
        let splitNews = await fetchSitePageLibrary(this.context)
        this.pgNewsFirstIndex = [];
        this.pgRestAllIndex = [];
        splitNews.forEach((item: any, index: number) => {
          if (item != undefined) {
            // Find first index and push into first index array 
            if (item.index == 0) {
              let pgNewsglob = {
                id: item.id,
                title: item.title,
                pgLocation: item.pgLocation,
                pgLink: item.pgLink,
                pgQuickLink: item.pgQuickLink,
                pgCarouselImage: item.pgCarouselImage,
                newsDescription: item.newsDescription,
                index: index,
                isRequested: false
              };
              this.pgNewsFirstIndex.push(pgNewsglob);
            }
            // push all the items into the secoundary index array
            else if (item.index != 0) {
              let pgNewsloc = {
                id: item.id,
                title: item.title,
                pgLocation: item.pgLocation,
                pgLink: item.pgLink,
                pgQuickLink: item.pgQuickLink,
                pgCarouselImage: item.pgCarouselImage,
                newsDescription: item.newsDescription,
                index: index,
                isRequested: false
              };
              this.pgRestAllIndex.push(pgNewsloc);

            }

          }
        });
// setting state variable for all the first and secound index along with getting List item record and storing into the state variable.
        this.setState({
          PGnewsCarousel: splitNews, PGnewsCarouselFirstIndexView: this.pgNewsFirstIndex,
          PGnewsCarouselRestAllIndexView: this.pgRestAllIndex,
          PromoteFetchListItem: await promoteFetchListItem(this.context)

        });
      }
// Onload validation for the promote to global request raised or not.
      await this.validationcheck();
      return Promise.resolve();
    }
    catch (error) {
      console.log("Error in OnInit Method : " + error);
    }


  }

  protected validationcheck = () => {
// with secound index array, checking the request raised if site page , ID and List item PageID should be matched. if matched, changing isRequested property to 'true'.
    this.state.PGnewsCarouselRestAllIndexView.forEach((item: IListItem, index: number) => {
      if (item != undefined) {
        if (item.pgLocation == "Local") {

          let findItemId = this.state.PromoteFetchListItem.filter((el: IPromoteReqListItem) => el.promotePageID == item.id);

          if (findItemId.length != 0) {

            item.isRequested = true;

          }

        }
      }
    });

// with first index array, checking the request raised if site page , ID and List item PageID should be matched. if matched, changing isRequested property to 'true'.
    this.state.PGnewsCarouselFirstIndexView.forEach((item: IListItem, index: number) => {
      if (item != undefined) {
        if (item.pgLocation == "Local") {

          let findItemId = this.state.PromoteFetchListItem.filter((el: IPromoteReqListItem) => el.promotePageID == item.id);

          if (findItemId.length != 0) {

            item.isRequested = true;

          }

        }
      }
    });

  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'PgNewsCarouselOnMenu-property-pane'*/
      './PgNewsCarouselOnMenuPropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.PgNewsCarouselOnMenuPropertyPane();
        }
      );
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane?.getPropertyPaneConfiguration();
  }
// if property pane changed, this method will get call.
  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any) {

  }
}
